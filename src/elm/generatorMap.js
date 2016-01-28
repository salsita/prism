export default function*(arr, mapper) {
  const data = [];

  function* recur(index) {
    data.push(yield* mapper(arr[index], index));

    if (index >= (arr.length - 1)) {
      return data;
    } else {
      return yield* recur(index + 1);
    }
  }

  return yield* recur(0);
}
