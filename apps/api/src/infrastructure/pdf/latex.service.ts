import { JakesTemplate }
  from "./templates/jakes.template.js";

class LatexService {
  generate(
    tailoredResume: any
  ) {
    const template =
      new JakesTemplate();

    return template.render(
      tailoredResume
    );
  }
}

export const latexService =
  new LatexService();