/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: async () => {
        return [
            {
                source: "/service-worker.js",
                headers: [
                    {
                        key: "Service-Worker-Allowed",
                        value: "false",
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
