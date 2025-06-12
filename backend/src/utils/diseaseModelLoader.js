// backend/src/utils/diseaseModelLoader.js
import * as tf from '@tensorflow/tfjs-node';

let model = null;

export default async function loadDiseaseModel(modelPath) {
  if (!model) {
    model = await tf.loadLayersModel(`file://${modelPath}`);
  }
  return {
    predict: async (tensor) => {
      const preds = model.predict(tensor);
      const scores = preds.dataSync();
      // assume you have a labels array in modelPath/labels.json
      const labels = require(path.resolve('ai-models/disease-cnn/labels.json'));
      const idx = scores.indexOf(Math.max(...scores));
      return { disease: labels[idx], confidence: scores[idx] };
    },
  };
}
