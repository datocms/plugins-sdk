import React, { ReactNode } from 'react';

// The API key of a model, a block or a field, in a row or in a text: small,
// monospaced and in the subtle ink.
export type ApiKeyProps = {
  /** The API key, or keys joined with a dot ("article.title"). */
  children: ReactNode;
};

function ApiKey({ children }: ApiKeyProps) {
  return <span className="ApiKey">{children}</span>;
}

export default React.memo(ApiKey);
