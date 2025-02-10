import { json, redirect, useActionData, useNavigation, useSearchParams, useSubmit } from "@remix-run/react";
import {
  Layout,
  Page, BlockStack,
  Text, Toast,
  Banner,
  Card,
  Link,
  CalloutCard,
  Box,
  List,
  InlineStack, Button
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import validateSettings from "../models/Script.server";
import db from "../db.server";

export async function loader({ request, params }) {
  const { admin,session } = await authenticate.admin(request,{scopes: ['write_script_tags', 'read_script_tags','write_themes','read_themes']});

  /* const response = await admin.graphql(
    `#graphql
  query MainTheme {
    themes(role:"MAIN") {
      edges {
        node {
          id
          name
          role
          themeStoreId
          processing
          processingFailed
        }
      }
    }
  }`,
  );

  const data = await response.json();

  console.log(data); */

  if (params.saved) {
   return Toast.show("Settings saved", { duration: 3000 });
  }else if(params.saved === false){
    return Toast.show("Settings not saved", { duration: 3000 });
  }

  return null
}

export async function action({ request ,params}) {
  const { session ,admin } = await authenticate.admin(request);

  const shop = session.shop;

  /** @type {any} */
  const data = {
    ...Object.fromEntries(await request.formData()),
  };
  const errors =  validateSettings(data);
  if (errors) {
    return json({ errors }, { status: 422 });
  }

  try {
    const records = await db.settings.findMany();
    if(records.length > 0){
      const settings = await db.settings.update({where: {id: records[0].id}, data});
    }else{
      const settings = await db.settings.create({data});
    }
    const scriptContent = `
     (function (w, d, s, l, g, i) {
      w[l] = w[l] || []; w[l].push({ 'tag.start': new Date().getTime(), event: 'tag.js', id: i, ad: g });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'cibleclic_pt' ? '&l=' + l : ''; j.async = true;
      j.src = 'https://' + i + '.userly.net/cl.js?id=' + i + '&ad=' + g + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'cibleclic_ptatest', ${data.advertiser_id}, ${data.offer_id});`;

    // First, delete any existing script tags from your app
    const existingScripts = await admin.rest.resources.ScriptTag.all({
      session: session,
    });

    for (const script of existingScripts.data) {
      await admin.rest.resources.ScriptTag.delete({
        session: session,
        id: script.id,
      });
    }

    // Create new script tag
    const scriptTag = new admin.rest.resources.ScriptTag({ session: session });
    scriptTag.event = "onload";
    scriptTag.src = `data:text/javascript,${encodeURIComponent(scriptContent)}`;
    scriptTag.display_scope = "online_store";
    await scriptTag.save();

    return redirect("/app/?saved=true");
  } catch (error) {
    console.error("Error creating script tag:", error);
    return redirect("/app/?saved=false");
  }

  //return settings ?   redirect("/app/?saved=true") : redirect("/app/?saved=false");
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
    <Page
    title="Welcome to Userly Analytics"
    primaryAction={
      <>
       <Button url="https://www.userly.net" external target="_blank">Get your credential</Button>
      </>
    }
  >
    <BlockStack gap="500">
      {/* Welcome Banner */}
      <Banner title="Thank you for choosing our application" status="success">
        <p>Follow the steps below to start tracking your store's performance.</p>
      </Banner>

      <Layout>
        <Layout.Section>
          {/* Quick Setup Card */}
          <CalloutCard
            title="Quick Setup Guide"
            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
            primaryAction={{
              content: 'Get Your Credentials',
              url: 'https://www.userly.net',
              _target: 'blank',
            }}
          >
            <BlockStack gap="400">
              <Text as="p">
                To enable tracking on your store, you'll need your unique credentials from the Userly dashboard.
              </Text>
            </BlockStack>
          </CalloutCard>
        </Layout.Section>

        <Layout.Section secondary>
          {/* Steps Card */}
          <Card>
            <BlockStack gap="400">
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Setup Steps
                  </Text>
                  <List type="number">
                    <List.Item>
                      Log in to your Userly dashboard
                    </List.Item>
                    <List.Item>
                      Navigate to Settings → offers
                    </List.Item>
                    <List.Item>
                      Copy your Advertiser and Offer IDs
                    </List.Item>
                    <List.Item>
                      Paste them in the configuration below
                    </List.Item>
                  </List>
                </BlockStack>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          {/* Configuration Card */}
          <Card>
            <BlockStack gap="400">
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Tracking Configuration on the theme page
                  </Text>

                  <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Setup Steps
                  </Text>
                  <List type="number">
                    <List.Item>
                      go to online store → themes
                    </List.Item>
                    <List.Item>
                      Click on Custumize
                    </List.Item>
                    <List.Item>
                      on the left side click on app embed blocks
                    </List.Item>
                    <List.Item>
                      Activate the Userly block = pages variables
                    </List.Item>
                    <List.Item>
                      Add ids you get from our platform
                    </List.Item>
                  </List>
                </BlockStack>
              </Box>

                  <InlineStack gap="400" wrap={false}>
                    <Text as="p">
                      Need help finding your credentials? Check our{' '}
                      <Link url="https://www.userly.net/docs" external>
                        documentation
                      </Link>
                    </Text>
                  </InlineStack>

                  {/* Add your form components here */}
                </BlockStack>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          {/* Configuration Card */}
          <Card>
            <BlockStack gap="400">
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Tracking Configuration on the Checkout thank you page
                  </Text>

                  <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Setup Steps
                  </Text>
                  <List type="number">
                    <List.Item>
                      go to settings
                    </List.Item>
                    <List.Item>
                      Click on Checkout
                    </List.Item>
                    <List.Item>
                      Click custumize
                    </List.Item>
                    <List.Item>
                      click on apps
                    </List.Item>
                    <List.Item>
                      Activate uzerly ext
                    </List.Item>
                    <List.Item>
                      Add ids you get from our platform
                    </List.Item>
                  </List>
                </BlockStack>
              </Box>

                  <InlineStack gap="400" wrap={false}>
                    <Text as="p">
                      Need help finding your credentials? Check our{' '}
                      <Link url="https://www.userly.net/docs" external>
                        documentation
                      </Link>
                    </Text>
                  </InlineStack>

                  {/* Add your form components here */}
                </BlockStack>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Help & Support Section */}
      </Layout>
    </BlockStack>
  </Page>
  );
}
