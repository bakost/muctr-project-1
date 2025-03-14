import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters.command import Command
from aiogram import html
from aiogram.enums.parse_mode import ParseMode
from aiogram.filters import Command
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram import F
from config import token

# from config_reader import config

# Включаем логирование, чтобы не пропустить важные сообщения
logging.basicConfig(level=logging.INFO)
# Объект бота
# bot = Bot(token=config.bot_token.get_secret_value())
bot = Bot(token=token)
# Диспетчер
dp = Dispatcher()


# Обработчик команды /course для создания кнопок
@dp.message(Command("course"))
async def cmd_course(message: types.Message):
    builder = InlineKeyboardBuilder()
    # Добавляем кнопки с текстом 1, 2, 3, 4
    for i in range(1, 5):
        builder.add(types.InlineKeyboardButton(
            text=str(i),
            callback_data=f"button_{i}"  # Генерируем callback_data для каждой кнопки
        ))
    await message.answer(
        "Нажмите на кнопку, чтобы выбрать курс",
        reply_markup=builder.as_markup()
    )


# Обработчик callback-запроса для всех кнопок
@dp.callback_query(F.data.startswith("button_"))
async def handle_button_click(callback: types.CallbackQuery):
    await callback.message.answer("Отлично! теперь выберите группу")  # Ответ пользователю
    await callback.answer()  # Закрываем callback, убирая "часики"


# @dp.message(Command("course"))
# async def cmd_course(message: types.Message):
#     await message.answer(f'Выберите курс', reply_markup=get_keyboard())


# Хэндлер на команду /start
@dp.message(Command("hello"))
async def cmd_hello(message: types.Message):
    await message.answer(
        f"Привет, {html.quote(message.from_user.full_name)}!",
        parse_mode=ParseMode.HTML
    )


# Запуск процесса поллинга новых апдейтов
async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
