// backend/src/utils/imagePreprocessor.js
import sharp from 'sharp';
import * as tf from '@tensorflow/tfjs-node';

export default async function preprocessImage(buffer) {
  // Resize & normalize
  const resized = await sharp(buffer)
    .resize(224, 224)
    .toFormat('png')
    .toBuffer();

  const uint8 = new Uint8Array(resized);
  let imgTensor = tf.node.decodeImage(uint8, 3);
  imgTensor = tf.image.resizeBilinear(imgTensor, [224, 224]);
  imgTensor = imgTensor.expandDims(0).toFloat().div(255.0);
  return imgTensor;
}