import {
  reactExtension, BlockStack, Text, View,
  Heading,
  Button, useStorage,
  useApi,
  useCartLines, useOrder,
  useSubscription
} from "@shopify/ui-extensions-react/checkout";
import { useCallback, useEffect, useState } from "react";

const orderDetailsBlock = reactExtension("purchase.checkout.footer.render-after", () => <OrderContent />);
export { orderDetailsBlock };

const thankYouBlock = reactExtension("purchase.thank-you.block.render", () => <Attribution />);
export { thankYouBlock };

function Attribution() {
  const [attribution, setAttribution] = useState('');
  const [loading, setLoading] = useState(false);
  // Store into local storage if the attribution survey was completed by the customer.
  const [attributionSubmitted, setAttributionSubmitted] = useStorageState('attribution-submitted')

  async function handleSubmit() {
    // Simulate a server request
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
      // Send the review to the server
      console.log('Submitted:', attribution);
      setLoading(false);
      setAttributionSubmitted(true)
      resolve();
    }, 750)});
  }

  const cartLines = useCartLines();
  const {orderConfirmation} = useApi();

  const {id} = useSubscription(orderConfirmation);

  // Log cart lines to see the full data structure
  console.log('order id ======xxxxxxxxx', id);

  // Each cart line contains product information like:
  cartLines.forEach(line => {
    console.log({
      id: line.merchandise.id,
      title: line.merchandise.title,
      quantity: line.quantity,
      price: line.cost.totalAmount.amount,
      variant: line.merchandise.selectedOptions,
      image: line.merchandise.image?.url
    },'messages about product');
  });

  // Hides the survey if the attribution has already been submitted
  if (attributionSubmitted.loading || attributionSubmitted.data === true) {
    return null;
  }

  return (
    <></>
  );
}

function OrderContent(){

  const order = useOrder()
  console.log(order)
  return (
    <></>
  )
}


function Survey({
  title,
  description,
  onSubmit,
  children,
  loading,
}) {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    await onSubmit();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <View border="base" padding="base" borderRadius="base">
        <BlockStack>
          <Heading>Thanks for your feedback!</Heading>
          <Text>Your response has been submitted</Text>
        </BlockStack>
      </View>
    );
  }

  return (
    <View border="base" padding="base" borderRadius="base">
      <BlockStack>
        <Heading>{title}</Heading>
        <Text>{description}</Text>
        {children}
        <Button kind="secondary" onPress={handleSubmit} loading={loading}>
          Submit feedback
        </Button>
      </BlockStack>
    </View>
  );
}

function useStorageState(key) {
  const storage = useStorage();
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function queryStorage() {
      const value = await storage.read(key)
      setData(value);
      setLoading(false)
    }

    queryStorage();
  }, [setData, setLoading, storage, key])

  const setStorage = useCallback((value) => {
    storage.write(key, value)
  }, [storage, key])

  return [{data, loading}, setStorage]
}
