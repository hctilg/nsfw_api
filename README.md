## NSFW API

NSFW detection on API

### Run

```bash
npm i
```
```bash
npm run serv
```
```bash
curl -X POST localhost:8080 -H 'Content-Type: multipart/form-data' -F 'image=@full/path/to/picture.jpg'
```

### Example

```bash
┌──(user@system)-[~/…/nsfw_api]
└─$ curl -X POST localhost:8080 -H 'Content-Type: multipart/form-data' -F 'image=@femboy.jpg'

{
  "ok": true,
  "result": [
    {
      "className": "Sexy",
      "probability": 0.989097356796265
    },
    {
      "className": "Porn",
      "probability": 0.00852344557642937
    },
    {
      "className": "Neutral",
      "probability": 0.0022735062520951
    },
    {
      "className": "Hentai",
      "probability": 0.000075523690611589
    },
    {
      "className": "Drawing",
      "probability": 0.000030182913178578
    }
  ]
}
```
