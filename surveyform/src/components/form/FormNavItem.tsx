"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { FormattedMessage } from "~/components/common/FormattedMessage";
import { getSectionCompletionPercentage } from "~/lib/responses/helpers";
import { getEditionSectionPath } from "~/lib/surveys/helpers";
import { SectionMetadata } from "@devographics/types";
import { useEdition } from "../SurveyContext/Provider";
import { useLocaleContext } from "~/i18n/context/LocaleContext";
import { FormInputProps } from "./typings";

interface SurveyNavItemProps extends FormInputProps {
  setShown: any;
  number: number;
  setNavLoading: any;
  currentSection: SectionMetadata;
}

const SurveyNavItem = ({
  submitForm,
  response,
  currentSection,
  number,
  setShown,
  stateStuff,
  readOnly,
  setNavLoading,
}: SurveyNavItemProps) => {
  const { currentTabindex, setCurrentFocusIndex } = stateStuff;
  const { locale } = useLocaleContext();
  const textInput = useRef<any>(null);
  const { edition } = useEdition();
  const completion = getSectionCompletionPercentage({
    edition,
    section: currentSection,
    response,
  });
  const showCompletion = completion !== null && completion > 0;

  const path = getEditionSectionPath({
    edition,
    response,
    number,
    locale,
  });

  useEffect(() => {
    if (currentTabindex === number) {
      textInput.current?.focus();
    }
  }, [currentTabindex]);

  const handleClick = async (e) => {
    e.preventDefault();
    await submitForm({
      path,
      beforeSubmitCallback: () => {
        setShown(false);
        setNavLoading(true);
      },
      afterSubmitCallback: () => {
        setNavLoading(false);
      },
    });
  };

  return (
    <li className="section-nav-item">
      {/** TODO: was a NavLink previously from bootstrap */}
      <Link
        //exact={true}
        href={getEditionSectionPath({
          edition,
          number,
          forceReadOnly: readOnly,
          response,
          locale,
        })}
        ref={textInput}
        tabIndex={currentTabindex === number ? 0 : -1}
        onFocus={() => {
          setCurrentFocusIndex(number);
        }}
        onBlur={() => {
          setCurrentFocusIndex(null);
        }}
        {...(!readOnly && { onClick: handleClick })}
      >
        <FormattedMessage
          id={`sections.${currentSection.intlId || currentSection.id}.title`}
        />{" "}
        {showCompletion && (
          <span className="section-nav-item-completion">{completion}%</span>
        )}
      </Link>
    </li>
  );
};

export default SurveyNavItem;