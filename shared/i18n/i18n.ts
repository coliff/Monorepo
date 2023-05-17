import type {
    SurveyMetadata,
    EditionMetadata,
    SectionMetadata,
    QuestionMetadata,
    OptionMetadata
} from '@devographics/types'

export const separator = '.'

export const getQuestioni18nIds = ({
    survey,
    edition,
    section,
    question
}: {
    survey: SurveyMetadata
    edition: EditionMetadata
    section: SectionMetadata
    question: QuestionMetadata
}) => {
    const { id: sectionId, slug } = section
    const sectionNamespace = slug || sectionId

    const { id: questionId, i18nNamespace, intlId } = question
    const questionNamespace = i18nNamespace || questionId

    const baseSegments = [sectionNamespace, questionNamespace]
    const base = intlId || baseSegments.join(separator)

    const joinWithBase = suffix => [base, suffix].join(separator)

    const ids = {
        // e.g. user_info.yearly_salary => "Yearly Salary" (legacy)
        base,
        // e.g. user_info.yearly_salary.title => "Yearly Salary"
        title: joinWithBase('title'),
        // e.g. user_info.yearly_salary.description => "How much do you earn?" (legacy)
        description: joinWithBase('description'),
        // e.g. user_info.yearly_salary.question => "How much do you earn?"
        question: joinWithBase('question'),
        // e.g. user_info.yearly_salary.note => a note about the question displayed below
        note: joinWithBase('note'),
        // e.g. resources.video_creators.others => "Other video creators" (legacy)
        others: joinWithBase('others')
    }

    return ids
}

export const getOptioni18nIds = ({
    survey,
    edition,
    section,
    question,
    option
}: {
    survey: SurveyMetadata
    edition: EditionMetadata
    section: SectionMetadata
    question: QuestionMetadata
    option: OptionMetadata
}) => {
    const { id, intlId } = option
    const { id: questionId, i18nNamespace } = question
    const questionNamespace = i18nNamespace || questionId

    const baseSegments = ['options', questionNamespace, id]
    const base = intlId || baseSegments.join(separator)

    const ids = {
        // e.g. options.yearly_salary.range_1000_2000
        base,
        // e.g. options.yearly_salary.range_1000_2000.description
        description: [base, 'description'].join(separator)
    }

    return ids
}

// just to avoid warnings, delete later
export const isIntlField = foo => false
export const formatLabel = foo => 'foobar'
export const getIntlKeys = foo => ['foo', 'bar']
export const getIntlLabel = foo => 'foo'