import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import {
  Layout,
  Page, BlockStack,
  Text, Banner,
  Card,
  Link,
  CalloutCard,
  Box,
  List,
  InlineStack, Button, Form, FormLayout, TextField,
  ButtonGroup
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import { getWebPixels } from '../models/Script.server';
import { useCallback, useEffect, useState } from "react";
import { json } from "stream/consumers";

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);
  const {webPixel} = await getWebPixels(admin.graphql);
  return webPixel || false;
}

export async function action({ request ,params}) {

  const formData = await request.formData();
  const intent = formData.get("intent");
  const pixelId = formData.get("pixelId");
  const { admin } = await authenticate.admin(request);

  if (intent === "delete" && pixelId) {
    try {
      // Execute GraphQL mutation to delete the web pixel
      const response = await admin.graphql(`
        mutation webPixelDelete($id: ID!) {
  webPixelDelete(id: $id) {
    deletedWebPixelId
    userErrors {
      field
      message
    }
  }
}`,
        {
          variables: {
            id: pixelId, // Make sure this is the full ID including the prefix if needed
          },
        }
      );

      const {data} = await response.json();
      return {
        success: data.webPixelDelete.userErrors.length === 0,
        errors: data.webPixelDelete.userErrors,
        isDelete:true
      }
    } catch (error) {
      console.error("Delete error:", error);
      return json({ success: false, error: "Failed to delete web pixel" }, { status: 500 });
    }
  }

  else if (intent === "add") {
    try {
      const advertiser = JSON.parse(formData.get("advertiser"));
      const offer = JSON.parse(formData.get("offer"));

      // Execute GraphQL mutation to create a new pixel
      const response = await admin.graphql(
        `#graphql
        mutation webPixelCreate($webPixel: WebPixelInput!) {
          webPixelCreate(webPixel: $webPixel) {
            userErrors {
              field
              message
              code
            }
            webPixel {
              id
              settings
            }
          }
        }`,
        {
          variables: {
            "webPixel": {
              "settings": `{\"advertiser\":\"${advertiser}\",\"offer\":\"${offer}\"}`
            }
          },
        },

      );

    const {data} = await response.json();

     return {
      success: data.webPixelCreate.userErrors.length === 0,
      pixel: data.webPixelCreate.webPixel,
      errors: data.webPixelCreate.userErrors,
      message:'Web pixel created successfully',
      isAdd: true,
    };

    } catch (error) {
      console.error("Add error:", error);
      return json({ success: false, error: "Failed to create pixel" }, { status: 500 });
    }
  }

  // Handle update operation
  else if (intent === "update") {
    try {
      const id = formData.get("id");
      const advertiser = JSON.parse(formData.get("advertiser"));
      const offer = JSON.parse(formData.get("offer"));


      // Execute GraphQL mutation to update an existing pixel
      const response = await admin.graphql(`
        mutation webPixelUpdate($id: ID!, $webPixel: WebPixelInput!) {
  webPixelUpdate(id: $id, webPixel: $webPixel) {
    userErrors {
      field
      message
    }
    webPixel {
      id
      settings
    }
  }
}`,
        {
          variables: {
            id: `${id}`,
            "webPixel": {
              "settings": `{\"advertiser\":\"${advertiser}\",\"offer\":\"${offer}\"}`
            }
          },
        }
      );

      const {data} = await response.json();

      return{
        success: data.webPixelUpdate.userErrors.length === 0,
        pixel: data.webPixelUpdate.webPixel,
        errors: data.webPixelUpdate.userErrors,
        message:'Web pixel updated successfully',
        isUpdate: true
      }
    } catch (error) {
      return json({ success: false, error: "Failed to update pixel" }, { status: 500 });
    }
  }

  return json({ success: false, error: "Invalid action" }, { status: 400 });
}



export default function Index() {
  //const qrCode = useLoaderData();
  const initialWebPixel = useLoaderData();
  const [webPixel, setWebPixel] = useState(initialWebPixel);
    const submit = useSubmit();
    console.log('webPixel', webPixel);

    const actionData = useActionData();

    console.log('actionData', actionData);

    const settings = webPixel?.settings || '{}';

    const parsedSettings = JSON.parse(settings) || {};

    const [advertiser, setAdvertiser] = useState(parsedSettings?.advertiser);
    const [offer, setOffer] = useState(parsedSettings?.offer);

    // State for showing the success/error message
  const [showMessage, setShowMessage] = useState(false);
  const [messageStatus, setMessageStatus] = useState("info");
  const [messageContent, setMessageContent] = useState("");


  useEffect(() => {
    if (initialWebPixel) {
      setWebPixel(initialWebPixel);
      try {
        const settings = initialWebPixel.settings || '{}';
        const parsedSettings = JSON.parse(settings) || {};
        setAdvertiser(parsedSettings.advertiser);
        setOffer(parsedSettings.offer);
      } catch (error) {
        console.error("Error parsing settings:", error);
      }
    } else {
      setWebPixel(false);
      setAdvertiser('');
      setOffer('');
    }
  }, [initialWebPixel]);

      // Effect to handle action data updates including new pixel creation
  useEffect(() => {
    if (actionData) {
      setShowMessage(true);

      if (actionData.success) {
        setMessageStatus("success");
        setMessageContent(
          actionData.message || 'Operation completed successfully'
        );

        // If delete operation was successful, reset the form fields and webPixel
        if (actionData.isDelete) {
          setAdvertiser('');
          setOffer('');
          setWebPixel(false);
        }
        // If add or update operation was successful, update the webPixel state
        else if (actionData.isAdd || actionData.isUpdate) {
          if (actionData.pixel) {
            setWebPixel(actionData.pixel);
            try {
              const settings = actionData.pixel.settings || '{}';
              const parsedSettings = JSON.parse(settings) || {};
              setAdvertiser(parsedSettings.advertiser);
              setOffer(parsedSettings.offer);
            } catch (error) {
              console.error("Error parsing settings:", error);
            }
          }
        }
      } else {
        setMessageStatus("critical");
        setMessageContent(
          actionData.error ||
          (actionData.errors && actionData.errors.length > 0
            ? actionData.errors[0].message
            : "An error occurred")
        );
      }

      // Auto-hide message after 5 seconds
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [actionData]);



    const handleAdvertiserChange = useCallback(
      (value) => setAdvertiser(value),
    [],
    )

    const handleOfferChange = useCallback(
      (value) => setOffer(value),[]
    )

    const handleDelete = useCallback(() => {
      if (confirm(`Are you sure you want to delete pixel ${webPixel.id}?`)) {
        const formData = new FormData();
        formData.append("intent", "delete");
        formData.append("pixelId", webPixel.id);
        submit(formData, { method: "post" });
      }
    }, [submit, webPixel.id]);

    const handleSave = () => {


      const data = {
        advertiser,
        offer,
        intent: webPixel ? "update" : "add"
      };

      if (webPixel) {
        data.id = webPixel.id;
      }

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
        <Layout.Section>
  <Card>
    <BlockStack gap="400">
      <Box padding="400">
        <BlockStack gap="400">
        {showMessage && (
          <Banner
            title={messageStatus === "success" ? "Success" : "Error"}
            status={messageStatus}
            onDismiss={() => setShowMessage(false)}
          >
            <p>{messageContent}</p>
          </Banner>
        )}
          <Text variant="headingMd" as="h2">
            Web Pixel Integration
          </Text>
          <Text as="p">
            Create a web pixel to track user activity and conversions across your store.
            This will allow you to measure the effectiveness of your marketing campaigns.
          </Text>
          <Form onSubmit={()=>{}}>
      <FormLayout>
        <TextField
          value={advertiser}
          onChange={handleAdvertiserChange}
          label="advertiser"
          type="number"
          autoComplete="Advertiser"
          helpText={
            <span>
              We’ll use this id as your advertiser id on the web pixel
            </span>
          }
        />
        <TextField
          value={offer}
          onChange={handleOfferChange}
          label="offer"
          type="number"
          autoComplete="Offer"
          helpText={
            <span>
              We’ll use this id as your offer id on the web pixel
            </span>
          }
        />


        {
          advertiser && offer && (
            <ButtonGroup>
                <Button onClick={handleSave}>{ webPixel  ? 'Update' : 'Add'}</Button>
                <Button disabled={!webPixel} onClick={handleDelete} tone="critical">Delete</Button>
            </ButtonGroup>
          )
        }
      </FormLayout>
    </Form>
        </BlockStack>
      </Box>
    </BlockStack>
  </Card>
</Layout.Section>

      </Layout>
    </BlockStack>
  </Page>
  );
}
