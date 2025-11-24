<?php
/**
 * Plugin Name:       WP A/B Master Dashboard
 * Description:       React-based CRO dashboard packaged as a native WordPress admin plugin.
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Version:           1.0.0
 * Author:            AI Generated
 */

if (!defined('ABSPATH')) {
    exit;
}

class CroAbMasterDashboard {
    private const MENU_SLUG = 'cro-plugin-dashboard';
    private const ROOT_ID = 'cro-plugin-root';
    private const VERSION = '1.0.0';

    public function __construct() {
        add_action('admin_menu', [$this, 'register_admin_page']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public function register_admin_page(): void {
        add_menu_page(
            __('WP A/B Master Dashboard', 'cro-plugin'),
            __('WP A/B Master', 'cro-plugin'),
            'manage_options',
            self::MENU_SLUG,
            [$this, 'render_app'],
            'dashicons-chart-area',
            30
        );
    }

    public function enqueue_assets(string $hook_suffix): void {
        if ($hook_suffix !== 'toplevel_page_' . self::MENU_SLUG) {
            return;
        }

        $plugin_dir = plugin_dir_path(__FILE__);
        $plugin_url = plugin_dir_url(__FILE__);
        $manifest_path = $plugin_dir . 'build/.vite/manifest.json';

        if (!file_exists($manifest_path)) {
            add_action('admin_notices', static function () {
                echo '<div class="notice notice-error"><p>' . esc_html__('Build assets are missing. Run "npm install" and "npm run build" to generate the plugin bundle.', 'cro-plugin') . '</p></div>';
            });
            return;
        }

        $manifest = json_decode(file_get_contents($manifest_path), true);
        $entry = $manifest['index.html'] ?? $manifest['index.tsx'] ?? null;

        if (!$entry || empty($entry['file'])) {
            add_action('admin_notices', static function () {
                echo '<div class="notice notice-error"><p>' . esc_html__('Unable to locate the Vite entry point from the manifest.', 'cro-plugin') . '</p></div>';
            });
            return;
        }

        wp_enqueue_script('cro-plugin-tailwind', 'https://cdn.tailwindcss.com', [], null, false);
        wp_enqueue_style('cro-plugin-base', $plugin_url . 'assets/css/cro-plugin.css', [], self::VERSION);

        $asset_base = $plugin_url . 'build/';
        $imports = $entry['imports'] ?? [];
        $dependencies = ['cro-plugin-tailwind'];

        foreach ($imports as $index => $import) {
            if (!isset($manifest[$import]['file'])) {
                continue;
            }

            $handle = 'cro-plugin-import-' . $index;
            wp_enqueue_script($handle, $asset_base . $manifest[$import]['file'], [], self::VERSION, true);
            $dependencies[] = $handle;
        }

        if (!empty($entry['css'])) {
            foreach ($entry['css'] as $i => $css_file) {
                wp_enqueue_style('cro-plugin-style-' . $i, $asset_base . $css_file, ['cro-plugin-base'], self::VERSION);
            }
        }

        wp_enqueue_script('cro-plugin-app', $asset_base . $entry['file'], $dependencies, self::VERSION, true);

        wp_localize_script('cro-plugin-app', 'croPluginConfig', [
            'rootId' => self::ROOT_ID,
            'apiKey' => defined('CRO_PLUGIN_GEMINI_API_KEY') ? CRO_PLUGIN_GEMINI_API_KEY : '',
        ]);
    }

    public function render_app(): void {
        echo '<div id="' . esc_attr(self::ROOT_ID) . '"></div>';
    }
}

new CroAbMasterDashboard();
