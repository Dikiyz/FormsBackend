import Router from "express";

const router = new Router();
router.set('view engine', 'pug');
router.set('views', 'src/views');

// Хотел сделать отдельно удаление и добавления форм, но правильнее
// будет оставить это в formRouter, а здесь в будущем сделать
// управление администраторами (назначение, снятие и т.д.).

export default router;