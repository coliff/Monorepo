import { TemplateArguments } from './types'
import { TOOLS_OPTIONS, FEATURES_OPTIONS } from '../constants'

const isFreeformField = (id: string) => ['_others', '_freeform'].some(s => id.includes(s))

const getSuffix = (id: string) => (isFreeformField(id) ? 'others.normalized' : 'choices')

const defaultTemplateFunction = ({ question, section }: TemplateArguments) => ({
    path: `${section.id}.${question.id}`
})

const doNotInclude = () => ({
    includeInApi: false
})

export const templates = {
    feature: ({ question }: TemplateArguments) => ({
        path: `features.${question.id}.choices`,
        options: FEATURES_OPTIONS.map(id => ({
            id
        })),
        fieldTypeName: 'Feature',
        filterTypeName: 'FeatureExperienceFilter',
        optionTypeName: 'FeatureExperienceOption',
        enumTypeName: 'FeatureExperienceID'
    }),
    tool: ({ question }: TemplateArguments) => ({
        path: `tools.${question.id}.choices`,
        options: TOOLS_OPTIONS.map(id => ({
            id
        })),
        fieldTypeName: 'Tool',
        filterTypeName: 'ToolExperienceFilter',
        optionTypeName: 'ToolExperienceOption',
        enumTypeName: 'ToolExperienceID'
    }),
    multiple: ({ question, section }: TemplateArguments) => ({
        path: `${section.id}.${question.id}.choices`
    }),
    single: ({ question, section }: TemplateArguments) => ({
        path: `${section.id}.${question.id}.choices`
    }),
    others: ({ question, section }: TemplateArguments) => ({
        path: `${section.id}.${question.id.replace('_others', '.others')}.normalized`
    }),
    happiness: ({ question, section }: TemplateArguments) => ({
        path: `${section.id}.${question.id.replace('_happiness', '.happiness')}`
    }),
    project: ({ question, section }: TemplateArguments) => ({
        path: `${section.id}.${question.id.replace('_prenormalized', '.others')}.normalized`
    }),

    opinion: defaultTemplateFunction,
    bracket: defaultTemplateFunction,
    text: defaultTemplateFunction,
    longtext: defaultTemplateFunction,
    slider: defaultTemplateFunction,
    race_ethnicity: defaultTemplateFunction,
    country: defaultTemplateFunction,
    top_n: defaultTemplateFunction,

    email2: doNotInclude,
    receive_notifications: doNotInclude,
    help: doNotInclude

    // resources: {
    //   path: (id:string) => `resources.${id}.${getSuffix(id)}`
    // },
    // usage: {
    //   path: (id:string) => `usage.${id}.${getSuffix(id)}`
    // },
    // opinions: {
    //   path: (id:string) => `opinions.${id}.${getSuffix(id)}`
    // }
}