shopify-gulpfile
================

Gulp configuration for Shopify theme development

### Pre-processes CSS

Uses Sass and autoprefixer to pre-process CSS files. Since autoprefixer doesn't
parse Liquid tags inside CSS (`{{ item }}`), liquid.scss is not passed through
autoprefixer.

### Uploads theme files via API

It uses [shopify_theme](https://github.com/Shopify/shopify_theme) Ruby gem to
upload changed files to Shopify via API. The config.yml file should be present
in project root for shopify_theme to work correctly.
