// Reads a photo, finds the person and the face with Apple's Vision framework,
// and writes two grayscale PGM files: the photo and the person mask.
// build-portrait.mjs calls this script. macOS only.
//
//   swift scripts/portrait-cutout.swift <photo> <out-prefix> [max-side]
//
// Output: <out-prefix>.gray.pgm, <out-prefix>.mask.pgm, and one JSON line on stdout.

import CoreGraphics
import CoreImage
import Foundation
import ImageIO
import Vision

func fail(_ message: String) -> Never {
  FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
  exit(1)
}

let args = CommandLine.arguments
guard args.count >= 3 else { fail("usage: portrait-cutout.swift <photo> <out-prefix> [max-side]") }
let maxSide = args.count > 3 ? Int(args[3]) ?? 900 : 900

// Decode with the EXIF rotation applied, at a reduced size.
guard let source = CGImageSourceCreateWithURL(URL(fileURLWithPath: args[1]) as CFURL, nil) else {
  fail("cannot open \(args[1])")
}
let thumbOptions: [CFString: Any] = [
  kCGImageSourceCreateThumbnailFromImageAlways: true,
  kCGImageSourceCreateThumbnailWithTransform: true,
  kCGImageSourceThumbnailMaxPixelSize: maxSide,
]
guard let image = CGImageSourceCreateThumbnailAtIndex(source, 0, thumbOptions as CFDictionary) else {
  fail("cannot decode \(args[1])")
}
let width = image.width
let height = image.height

// Draws any CGImage into an 8-bit gray buffer of the photo's size.
func grayBytes(_ cg: CGImage) -> [UInt8] {
  var bytes = [UInt8](repeating: 0, count: width * height)
  bytes.withUnsafeMutableBytes { buffer in
    let context = CGContext(
      data: buffer.baseAddress, width: width, height: height, bitsPerComponent: 8,
      bytesPerRow: width, space: CGColorSpaceCreateDeviceGray(),
      bitmapInfo: CGImageAlphaInfo.none.rawValue)!
    context.interpolationQuality = .high
    context.draw(cg, in: CGRect(x: 0, y: 0, width: width, height: height))
  }
  return bytes
}

func writePGM(_ bytes: [UInt8], _ path: String) {
  var data = "P5\n\(width) \(height)\n255\n".data(using: .ascii)!
  data.append(contentsOf: bytes)
  do { try data.write(to: URL(fileURLWithPath: path)) } catch { fail("cannot write \(path)") }
}

let handler = VNImageRequestHandler(cgImage: image, options: [:])

// Person mask. A photo with no person gives an all-white mask, so the script still works.
var mask = [UInt8](repeating: 255, count: width * height)
var hasMask = false
let segmentation = VNGeneratePersonSegmentationRequest()
segmentation.qualityLevel = .accurate
segmentation.outputPixelFormat = kCVPixelFormatType_OneComponent8

// Largest face, in pixels from the top-left corner.
var face: [String: Int]? = nil
let faces = VNDetectFaceRectanglesRequest()

do { try handler.perform([segmentation, faces]) } catch { fail("Vision failed: \(error)") }

if let buffer = segmentation.results?.first?.pixelBuffer {
  let ci = CIImage(cvPixelBuffer: buffer)
  if let cg = CIContext().createCGImage(ci, from: ci.extent) {
    mask = grayBytes(cg)
    hasMask = true
  }
}

if let best = faces.results?.max(by: {
  $0.boundingBox.width * $0.boundingBox.height < $1.boundingBox.width * $1.boundingBox.height
}) {
  let box = best.boundingBox  // normalized, origin at the bottom-left
  face = [
    "x": Int(box.minX * CGFloat(width)),
    "y": Int((1 - box.maxY) * CGFloat(height)),
    "w": Int(box.width * CGFloat(width)),
    "h": Int(box.height * CGFloat(height)),
  ]
}

writePGM(grayBytes(image), args[2] + ".gray.pgm")
writePGM(mask, args[2] + ".mask.pgm")

var report: [String: Any] = ["width": width, "height": height, "hasMask": hasMask]
if let face = face { report["face"] = face }
let json = try! JSONSerialization.data(withJSONObject: report, options: [.sortedKeys])
print(String(data: json, encoding: .utf8)!)
