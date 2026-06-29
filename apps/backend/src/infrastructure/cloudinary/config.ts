import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'dwgni4zdl',
  api_key: '153528717162138',
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary