import { json, redirect, useActionData, useNavigation, useSearchParams, useSubmit } from "@remix-run/react";
import {
  Layout,
  Page,
  TextField, BlockStack,
  Text,
  PageActions,
  Toast,
  Banner,
  Card
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import validateSettings from "../models/Script.server";
import db from "../db.server";

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);

  if (params.saved) {
   return Toast.show("Settings saved", { duration: 3000 });
  }else if(params.saved === false){
    return Toast.show("Settings not saved", { duration: 3000 });
  }

  return null
}

export async function action({ request ,params}) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  /** @type {any} */
  const data = {
    ...Object.fromEntries(await request.formData()),
  };
  const errors =  validateSettings(data);
  if (errors) {
    return json({ errors }, { status: 422 });
  }
  const records = await db.settings.findMany();
  if(records.length > 0){
    const settings = await db.settings.update({where: {id: records[0].id}, data});
    return settings ?   redirect("/app/?saved=true") : redirect("/app/?saved=false");
  }
  const settings = await db.settings.create({data});

  return settings ?   redirect("/app/?saved=true") : redirect("/app/?saved=false");
}

export default function Index() {
  //const qrCode = useLoaderData();

  const [searchParams] = useSearchParams();
  const saved = searchParams.get("saved");

  const errors = useActionData()?.errors || {};
  const [formState, setFormState] = useState({
    advertiser_id: "",
    offer_id: "",
  });
  const [cleanFormState, setCleanFormState] = useState({});
  const isDirty = JSON.stringify(formState) !== JSON.stringify(cleanFormState);

  const nav = useNavigation();
  const isSaving = nav.state === "submitting";

    const submit = useSubmit();
  function handleSave() {
    const data = {
      advertiser_id: Number(formState.advertiser_id) ,
      offer_id: Number(formState.offer_id),
    };

    setCleanFormState({ ...formState });
    submit(data, { method: "post" });

  }


  return (
    <Page title="Add Offer Details">
      <Layout>
      {saved && (
          <Layout.Section>
            <Banner
              title="Settings saved"
              status="success"
              onDismiss={() => {
                const params = new URLSearchParams(searchParams);
                params.delete("saved");
                submit(params);
              }}
            />
          </Layout.Section>
        )}
        <Layout.Section>
          <Card title="Add Offer Details" sectioned>
          <BlockStack gap="500">
              <BlockStack gap="500">
                <Text as={"h2"} variant="headingLg">
                  Advertiser id
                </Text>
                <TextField
                  id="Advertiser id"
                  label="Advertiser id"
                  labelHidden
                  autoComplete="off"
                  value={formState.advertiser_id}
                  onChange={(advertiser_id) => setFormState({ ...formState, advertiser_id })}
                  error={errors.advertiser_id}
                  type="number"
                />
              </BlockStack>
              <BlockStack gap="500" >
                <Text as={"h2"} variant="headingLg">
                  Offer id
                </Text>
                <TextField
                  id="Offer id"
                  label="Offer id"
                  labelHidden
                  autoComplete="off"
                  value={formState.offer_id}
                  onChange={(offer_id) => setFormState({ ...formState, offer_id })}
                  error={errors.offer_id}
                  type="number"
                />
              </BlockStack>
          </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <PageActions
            primaryAction={{
              content: "Save",
              loading: isSaving,
              disabled: !isDirty || isSaving,
              onAction: handleSave,
            }}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
