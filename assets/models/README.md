# 3D model slots

Put GLB files in this folder to replace the built-in shape-based fallback models.
The premium procedural GLB set is already enabled in `manifest.js`.
To regenerate the current set, run:

```bash
node scripts/generate-assets.js
```

Expected file names:

- `chaea.glb`: main character. Face +Z in the default pose. The app rotates the whole model by direction.
- `block-red.glb`
- `block-blue.glb`
- `block-yellow.glb`
- `block-green.glb`
- `goal-star.glb`
- `obstacle-rock.glb`
- `tree.glb`
- `cloud.glb`

Example `manifest.js`:

```js
window.mobloModelManifest = {
  "chaea": "chaea.glb",
  "block-red": "block-red.glb",
  "block-blue": "block-blue.glb",
  "goal": "goal-star.glb"
};
```

Notes:

- Use `.glb` when possible so textures travel with the model.
- Keep the model origin near the bottom center. The app also auto-centers and scales the model at load time.
- If a file is missing, the app keeps using the current built-in fallback asset.
- For local testing, run the app through a small HTTP server such as `python -m http.server 5173`.
