import { Router } from 'express';
import { validateDto } from '../../common/middleware/validate-dto.ts';
import CreateProductDto from './dto/create-product.dto.ts';
import ProductsController from './products.controller.ts';
import { validateIdParam } from '../../common/middleware/validate-param.ts';
import UpdateProductsDto from './dto/update-products.dto.ts';
import UpdatePartialProductsDto from './dto/partial-products.dto.ts';

const productRouter = Router();

productRouter.post(
    '/',
    validateDto(CreateProductDto),
    ProductsController.create,
);

productRouter.get('/', ProductsController.findAll);

productRouter.get('/:id', validateIdParam, ProductsController.findById);

productRouter.put(
    '/:id',
    validateIdParam,
    validateDto(UpdateProductsDto),
    ProductsController.update,
);

productRouter.patch(
    '/:id',
    validateIdParam,
    validateDto(UpdatePartialProductsDto),
    ProductsController.updatePartial,
);

productRouter.delete('/:id', validateIdParam, ProductsController.delete);

export default productRouter;
