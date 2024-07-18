import React, { useState, useEffect } from "react";
import QuestionLabel from "../form/QuestionLabel";
import { getSectionTokens } from "~/i18n/survey";
import { questionIsCompleted } from "~/lib/responses/helpers";
import { TokenType, useIntlContext } from "@devographics/react-i18n-legacy";
import { FormLayoutProps } from "../form/FormLayout";
import { useFormStateContext } from "../form/FormStateContext";
import { useFormPropsContext } from "../form/FormPropsContext";
import { DynamicT } from "@devographics/react-i18n";

const SurveySectionHeading = ({ section }: FormLayoutProps) => {
  const { stateStuff, response } = useFormStateContext();
  const { sectionNumber, edition } = useFormPropsContext();

  const { id, intlId } = section;
  const { itemPositions } = stateStuff;
  const intl = useIntlContext();
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const hasDescription =
    intl.formatMessage({
      id: getSectionTokens({ section }).description,
    }).type !== TokenType.KEY_FALLBACK;

  return (
    <div className="section-heading">
      <div className="section-heading-contents">
        <div className="section-heading-inner">
          <h2 className="section-title">
            <span className="section-title-pagenumber">
              {sectionNumber}/{edition.sections.length}
            </span>
            <DynamicT
              className="section-title-label"
              token={getSectionTokens({ section }).title}
              fallback={id}
              values={{ ...edition }}
            />
          </h2>
          {hasDescription && (
            <p className="section-description">
              <DynamicT
                token={getSectionTokens({ section }).description}
                fallback={id}
                values={{ ...edition }}
              />
            </p>
          )}
        </div>
        <div className="section-toc">
          <ol>
            {section.questions
              .filter((q) => !q.hidden && !["subheading"].includes(q.template))
              .map((question) => (
                <QuestionItem
                  key={question.id}
                  edition={edition}
                  section={section}
                  question={question}
                  scrollPosition={scrollPosition}
                  itemPositions={itemPositions}
                  response={response}
                />
              ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

/*

Get the item currently in viewport

*/
const offset = 200;
export const getItemIdInViewport = (
  scrollPosition: number,
  itemPositions: { [key: string]: number },
) => {
  return Object.keys(itemPositions)
    .reverse()
    .find((id) => itemPositions[id] < scrollPosition + offset);
};

const QuestionItem = ({
  edition,
  section,
  question,
  scrollPosition,
  itemPositions,
  response,
}) => {
  const currentItemId = getItemIdInViewport(scrollPosition, itemPositions);
  const isHighlighted = currentItemId === question.id;
  const isCompleted = response
    ? questionIsCompleted({ edition, question, response })
    : false;
  return (
    <li>
      <a
        href={`#${question.id}`}
        className={`${isHighlighted ? "highlighted" : "not-highlighted"} ${
          isCompleted ? "completed" : "not-completed"
        }`}
      >
        <QuestionLabel
          section={section}
          question={question}
          formatCode={true}
          variant="short"
        />
      </a>
    </li>
  );
};

export default SurveySectionHeading;
