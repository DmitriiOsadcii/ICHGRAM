import axios from "axios";

// Универсальная обёртка без any в возвращаемом значении
export type AsyncFn<P extends unknown[], R> = (...args: P) => Promise<R>;

const requestDecorator = <P extends unknown[], R>(fn: AsyncFn<P, R>): AsyncFn<P, R> => {
  return async (...args: P): Promise<R> => {
    try {
      return await fn(...args);
    } catch (err) {
      // ✅ Сохраняем AxiosError как есть (с .response, .config, .code)
      if (axios.isAxiosError(err)) {
        err.message = err.response?.data?.message ?? err.message;
        throw err; // не создаём новый Error!
      }
      // Незаказанные ошибки пробрасываем как есть
      throw err instanceof Error ? err : new Error("Unknown error");
    }
  };
};

export default requestDecorator;