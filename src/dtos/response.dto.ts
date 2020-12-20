export type Success<S> = { success: true, result: S };
export type Error<E> = { success: false, error: E };
export type ApiResponse<S, E> = Success<S> | Error<E>;

export const ResponseDto = Object.freeze({
    Success: <S, E>(result: S): ApiResponse<S, E> => ({ success: true, result, }),
    Error: <S, E>(error: E): ApiResponse<S, E> => ({ success: false, error,}),
});