import { Request, Response } from "express";
import * as inventoryService from "../services/inventory.service";

// ➤ Create Inventory
export const createInventory = async (req: Request, res: Response) => {
  try {
    console.log("📥 CREATE INVENTORY BODY:", req.body);

    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "productId and quantity are required",
      });
    }

    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "quantity must be a non-negative number",
      });
    }

    const inventory = await inventoryService.createInventory({
      productId,
      quantity,
    });

    return res.status(201).json({
      success: true,
      data: inventory,
    });

  } catch (error: any) {

    console.error("❌ Create Inventory Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ➤ Get Inventory
export const getInventoryByProduct = async (
  req: Request,
  res: Response
) => {

  try {

    const { productId } = req.params;

    console.log("🔎 GET INVENTORY productId:", productId);


    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }


    const inventory =
      await inventoryService.getByProductId(productId);


    return res.json({
      success: true,
      data: inventory,
    });


  } catch (error: any) {

    console.error("❌ Get Inventory Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};



// ➤ Update Stock (Admin)
export const updateStock = async (
  req: Request,
  res: Response
) => {

  try {

    const { productId } = req.params;
    const { quantity } = req.body;


    console.log("✏️ UPDATE STOCK");
    console.log("productId:", productId);
    console.log("quantity:", quantity);


    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "productId and quantity are required",
      });
    }


    const inventory =
      await inventoryService.updateStock(
        productId,
        quantity
      );


    return res.json({
      success: true,
      data: inventory,
    });


  } catch (error: any) {

    console.error("❌ Update Stock Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ➤ Reduce Stock (Order flow)
export const reduceStock = async (
  req: Request,
  res: Response
) => {

  try {

    console.log("📥 REDUCE STOCK BODY:", req.body);


    const { productId, quantity } = req.body;


    console.log("🔎 productId received:", productId);
    console.log("🔢 quantity received:", quantity);



    if (!productId || quantity === undefined) {

      return res.status(400).json({
        success: false,
        message: "productId and quantity are required",
      });

    }



    const inventory =
      await inventoryService.reduceStock(
        productId,
        quantity
      );



    console.log(
      "✅ REDUCE STOCK SUCCESS:",
      inventory
    );



    return res.json({
      success: true,
      data: inventory,
    });



  } catch (error: any) {


    console.error(
      "❌ Reduce Stock Error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
