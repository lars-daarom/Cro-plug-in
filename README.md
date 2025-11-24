<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/17Vr5obPMyOTX52O8gEJ0l_qHpTvlP5Fl

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Use as a native WordPress plugin

1. Build the production assets so the WordPress plugin can enqueue them:
   `npm run build`
2. Copy this project folder into your WordPress `wp-content/plugins` directory (or create a zip of the repository and upload it via **Plugins → Add New**).
3. Optional: define `CRO_PLUGIN_GEMINI_API_KEY` in your `wp-config.php` to inject your Gemini API key at runtime without rebuilding.
4. Activate **WP A/B Master Dashboard** from the WordPress Plugins screen. The dashboard will appear as a top-level admin menu item.
