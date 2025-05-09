import { imageUploadUtil } from "../../helpers/cloundinary.js";
import Product from "../../models/Product.js";

export const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const newProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

// Fetch all products
export const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

// Edit a product
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image, // Đây phải là URL ảnh mới từ Cloudinary
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Chỉ cập nhật các trường được cung cấp
    const updateFields = {
      title: title || product.title,
      description: description || product.description,
      category: category || product.category,
      brand: brand || product.brand,
      price: price !== undefined ? price : product.price,
      salePrice: salePrice !== undefined ? salePrice : product.salePrice,
      totalStock: totalStock !== undefined ? totalStock : product.totalStock,
    };

    if (image) {
      updateFields.image = image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};
