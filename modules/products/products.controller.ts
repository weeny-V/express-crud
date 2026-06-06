import type { RequestHandler } from 'express';
import ProductsService from './products.service.ts';
import type CreateProductDto from './dto/create-product.dto.ts';
import type { ProductData } from './products.types.ts';

const ProductsController = {
    create: (async (req, res) => {
        const product = await ProductsService.create(
            req.body as CreateProductDto,
        );
        return res.status(201).json({
            product,
        });
    }) satisfies RequestHandler,

    findAll: (async (_req, res) => {
        const products = await ProductsService.findAll();
        return res.status(200).json({
            products,
        });
    }) satisfies RequestHandler,

    findById: (async (req, res) => {
        const product = await ProductsService.findById(Number(req.params.id));
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({
            product,
        });
    }) satisfies RequestHandler,

    update: (async (req, res) => {
        const product = await ProductsService.update(
            Number(req.params.id),
            req.body as ProductData,
        );
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({
            product,
        });
    }) satisfies RequestHandler,

    updatePartial: (async (req, res) => {
        const product = await ProductsService.partialUpdate(
            Number(req.params.id),
            req.body as ProductData,
        );
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({
            product,
        });
    }) satisfies RequestHandler,

    delete: (async (req, res) => {
        const deleted = await ProductsService.delete(Number(req.params.id));
        if (!deleted) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.status(204).send();
    }) satisfies RequestHandler,
};

export default ProductsController;
