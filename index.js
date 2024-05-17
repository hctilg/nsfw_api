const express = require("express");
const multer = require("multer");
const jpeg = require("jpeg-js");

const tf = require("@tensorflow/tfjs-node");
const nsfw = require("nsfwjs");

const app = express();
const upload = multer();
const port = 8080;

let _model;

const convert = async (img) => {
  // Decoded image in UInt8 Byte array
  const image = await jpeg.decode(img, { useTArray: true });

  const numChannels = 3;
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++)
    for (let c = 0; c < numChannels; ++c)
      values[i * numChannels + c] = image.data[i * 4 + c];

  return tf.tensor3d(values, [image.height, image.width, numChannels], "int32");
};

app.use(upload.single("image"), async (req, res) => {
  if (!req.file) res.status(400).json({ ok: false, result: "Missing image multipart/form-data" });
  else {
    const image = await convert(req.file.buffer);
    const predictions = await _model.classify(image);
    image.dispose();
    res.status(200).json({ ok: true, result: predictions });
  }
});

const load_model = async () => {
  _model = await nsfw.load();
};

// Keep the model in memory, make sure it's loaded only once
console.log(`Model:: Loading...`);
load_model().then(() => app.listen(port, () => {
    console.log(`Server:: http://localhost:${port}`);
}));

// curl --request POST localhost:[port] --header 'Content-Type: multipart/form-data' --data-binary 'image=@/full/path/to/picture.jpg'
// curl -X POST localhost:[port] -H 'Content-Type: multipart/form-data' -F 'image=@full/path/to/picture.jpg'
