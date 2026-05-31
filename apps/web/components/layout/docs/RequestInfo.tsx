import React from 'react'
import { CodeBlock } from './CodeBlock';

interface RequestInfoProps {
  title: string;
  description: string;
  request: string;
  response: string;
}

const RequestInfo = ({
  title,
  description,
  request,
  response,
}: RequestInfoProps) => {
  return (
    <div className="w-full min-w-0 space-y-4" id={title.toLowerCase().replace(" ", "-")}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <h3 className="font-mono">Request: {description}</h3>
      </div>

      <CodeBlock code={request} language="typescript" />

      <div className="space-y-4">
        <h3 className="font-mono">Response:</h3>

        <CodeBlock code={response} language="json" />
      </div>
    </div>
  )
}

export default RequestInfo