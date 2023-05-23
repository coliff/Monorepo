import { connectToRedis } from "~/lib/server/redis";
import { getRawResponsesCollection } from "@devographics/mongo";
import { Actions } from "~/lib/validation";
import { fetchEditionMetadataSurveyForm } from "@devographics/fetch";
import { EditionMetadata } from "@devographics/types";
import { getResponseSchema } from "~/lib/responses/schema";
import { restoreTypes, runFieldCallbacks, OnCreateProps } from "~/lib/schemas";
import type { ResponseDocument } from "@devographics/types";
import { ServerError } from "~/lib/server-error";
import { validateResponse } from "./validate";

export const duplicateResponseErrorId = "duplicate_response";

export async function createResponse({
  currentUser,
  clientData,
}: {
  currentUser: any;
  clientData: ResponseDocument;
}) {
  if (!process.env.ENABLE_ROUTE_HANDLERS) {
    throw new ServerError({
      id: "route_handlers",
      message: "work in progress route handlers",
      status: 400,
    });
  }
  connectToRedis();

  const { surveyId, editionId } = clientData;
  if (!surveyId || !editionId) {
    throw new ServerError({
      id: "missing_surveyid_editionid",
      message: "Missing surveyId or editionId",
      status: 400,
    });
  }

  // check for existing response
  const RawResponse = await getRawResponsesCollection();
  const currentResponse = await RawResponse.findOne({
    userId: currentUser._id,
    editionId,
  });
  if (currentResponse) {
    throw new ServerError({
      id: duplicateResponseErrorId,
      message: `You already started to answer the ${editionId} survey`,
      status: 400,
      properties: { responseId: currentResponse._id },
    });
  }

  // Get edition metadata
  let edition: EditionMetadata;
  try {
    edition = await fetchEditionMetadataSurveyForm({
      surveyId,
      editionId,
      calledFrom: "api/response/create",
    });
  } catch (error) {
    throw new ServerError({
      id: "fetch_edition",
      message: `Could not load edition metadata for surveyId: '${surveyId}', editionId: '${editionId}'`,
      status: 400,
      error,
    });
  }
  const survey = edition.survey;

  const schema = getResponseSchema({ survey, edition });

  clientData = restoreTypes({
    document: clientData,
    schema,
  });

  const props = {
    currentUser,
    clientData,
    survey: edition.survey,
    edition,
    action: Actions.CREATE,
  };

  // add server-defined properties
  const serverData = await runFieldCallbacks<OnCreateProps>({
    document: clientData,
    schema,
    action: Actions.CREATE,
    props,
  });

  // validate response
  validateResponse({ ...props, serverData });

  // insert
  const insertRes = await RawResponse.insertOne(serverData);

  return serverData;
}