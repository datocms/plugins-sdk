type Request<Input, Output> = {
  input: Input;
  resolve: (value: Output) => void;
};

/**
 * Puts the requests of one tick in one call of `load`, one call for each
 * group (for example the options of the call). `load` gives one output for
 * each input, in the same order: each request gets the output at its index.
 * When `load` fails, or gives a value that is not an array with one output
 * for each input, each request gets `fallback`.
 */
export function createTickBatcher<Group, Input, Output>({
  groupKey,
  load,
  fallback,
}: {
  groupKey: (group: Group) => string;
  load: (group: Group, inputs: Input[]) => Promise<Output[]>;
  fallback: Output;
}) {
  const queues = new Map<string, Array<Request<Input, Output>>>();

  function flush(key: string, group: Group) {
    const requests = queues.get(key) ?? [];
    queues.delete(key);

    load(
      group,
      requests.map((request) => request.input),
    ).then(
      (outputs) => {
        const valid =
          Array.isArray(outputs) && outputs.length === requests.length;

        requests.forEach((request, index) => {
          request.resolve((valid ? outputs[index] : undefined) ?? fallback);
        });
      },
      (error) => {
        console.error(error);
        for (const request of requests) request.resolve(fallback);
      },
    );
  }

  return function request(group: Group, input: Input): Promise<Output> {
    return new Promise((resolve) => {
      const key = groupKey(group);
      const queue = queues.get(key);

      if (queue) {
        queue.push({ input, resolve });
        return;
      }

      queues.set(key, [{ input, resolve }]);
      setTimeout(() => flush(key, group), 0);
    });
  };
}
