/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.svg$/,

            use: ["@svgr/webpack"],
        });

        if (!isServer) {
            config.resolve.fallback = { fs: false };
        }

        return config;
    },
    env: {
        SPOTIFY_API_KEY:
            "BQCYgNTSm6o3tUD1x-VBGH9Nw9o9ZU5xNiz-a-ReuCtMFrka6R2iMvuIaBcz85e472-hc2Ea0kDJAYDDx0ne-GiF649k_omx2DcsuTlIN2t8tYfO89v52zmAk7q9nVdjYw1ApkWsJcMbn3lAuOTSIqs0vFWaLsAn7Jk",
        GOOGLE_KEY: "AIzaSyDNqYRDsb-JaUan7UdP05alvuGHWCD6NwY",
    },
};
