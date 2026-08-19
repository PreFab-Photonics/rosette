import * as Python from "fumadocs-python/components";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

function PyFunction(props: ComponentProps<typeof Python.PyFunction>) {
  return (
    <>
      <span id={props.name} className="block scroll-mt-24" aria-hidden="true" />
      <Python.PyFunction {...props} />
    </>
  );
}

function PyAttribute(props: ComponentProps<typeof Python.PyAttribute>) {
  return (
    <>
      <span id={props.name} className="block scroll-mt-24" aria-hidden="true" />
      <Python.PyAttribute {...props} />
    </>
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...Python,
    PyFunction,
    PyAttribute,
    ...components,
  };
}
