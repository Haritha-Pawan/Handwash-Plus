import path from 'path';
import { realpathSync } from 'fs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },

  webpack(config, { dir }) {
    // On Windows, `dir` (from process.cwd()) may differ from the real
    // filesystem path only in casing, e.g. `frontend` vs `Frontend`.
    // Webpack uses path strings as module keys, so the same file gets
    // registered twice — once from the SWC loader (which uses realpathSync
    // internally → `Frontend`) and once from the entry point (which uses
    // process.cwd() → `frontend`). That creates two React instances and
    // breaks hooks. This plugin normalises every module resource path to
    // the canonical casing before webpack registers it.
    let realDir;
    try {
      realDir = realpathSync(dir);
    } catch {
      return config;
    }
    if (realDir === dir) return config; // same casing, nothing to do

    config.plugins.push({
      apply(compiler) {
        compiler.hooks.normalModuleFactory.tap('NormalizeCasing', (nmf) => {
          nmf.hooks.afterResolve.tap('NormalizeCasing', (resolveData) => {
            const cd = resolveData.createData;
            const resource = cd?.resource;
            if (resource) {
              // Case-insensitive check to see if this is inside our project
              const lowerResource = resource.toLowerCase();
              const lowerDir = dir.toLowerCase();
              if (lowerResource.startsWith(lowerDir + path.sep.toLowerCase())) {
                // Force use of canonical (realDir) casing
                cd.resource = realDir + resource.slice(dir.length);
              }
            }
          });
        });
      },
    });

    return config;
  },
};

export default nextConfig;
