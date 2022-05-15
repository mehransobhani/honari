module.exports = {
  reactStrictMode: true,
  //ignoreDuringBuilds: true,
  //basePath: '/newtest',
  ignoreDuringBuilds: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/site/checklogin',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ckeditor/plugins/smiley/images/:slug',
        destination: 'https://admin.honari.com/ckeditor/plugins/smiley/images/:slug',
        permanent: true,
      },
      {
       	source: '/honari_videos/:slug',
        destination: 'https://admin.honari.com/honari_videos/:slug',
        permanent: true,
      },
      {
       	source: '/image/media/:slug',
        destination: 'https://admin.honari.com/image/media/:slug',
        permanent: true,
      },
      {
       	source: '/users/returned/:slug',
        destination: 'https://admin.honari.com/users/returned/:slug',
        permanent: true,
      },
      {
       	source: '/shop',
        destination: '/products',
        permanent: true,
      },
      {
       	source: '/3shanbehbazar',
        destination: '/products',
        permanent: true,
      },
    ]
  },
}
