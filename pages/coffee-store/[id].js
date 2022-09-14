import Link from "next/link";
import coffeStoresData from "../../data/coffee-stores.json";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import classNames from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { StoreContext } from "../../store/store-context";
import { fetcher, isEmpty } from "../../utils";
import useSWR from "swr";

const CoffeeStore = (initialProps) => {
  let isInital = true;
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, imgUrl, neighbourhood, address } = coffeeStore;

      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighbourhood || "",
          address: address || "",
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (e) {
      console.error("Error creating coffee store", e);
    }
  };

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const router = useRouter();
  let id;

  useEffect(() => {
    if (isInital) {
      isInital = false;
      return;
    }
    if (!router.isFallback && isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find(
          (coffeeStore) => coffeeStore.id == id
        );
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          console.log("Creating Context Store");
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      // SSG
      console.log("Creating SSG Store");
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeStore]);

  const [votingCount, setVotingCount] = useState(0);

  const { data, error } = useSWR(
    `/api/getCoffeeStoreById?id=${initialProps.id}`,
    fetcher
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  id = router.query.id;

  const handleUpvoteButton = async () => {
    try {
      const { id } = coffeeStore;

      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const dbCoffeeStore = await response.json();
      const count = parseInt(votingCount + 1);
      setVotingCount(count);
    } catch (e) {
      console.error("Error upvoting the coffee store", e);
    }
  };

  if (error) {
    return <div>Something Went Wrong Retrieving Coffee Store</div>;
  }

  if (coffeeStore) {
    const { address, name, neighborhood, imgUrl } = coffeeStore;
    return (
      <div className={styles.layout}>
        <Head>
          <title>{name}</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.backToHomeLink}>
              <Link href="/">← Back to home</Link>
            </div>
            <div className={styles.nameWrapper}>
              <h1 className={styles.name}>{name}</h1>
            </div>

            <Image
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
              width={600}
              height={360}
              className={styles.storeImg}
              alt={name}
            />
          </div>
          <div className={classNames("glass", styles.col2)}>
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/places.svg" width="24" height="24" />
              <p className={styles.text}>
                {address || "Address not available"}
              </p>
            </div>

            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width="24" height="24" />
              <p className={styles.text}>
                {neighborhood || "Neighbourhood not available"}
              </p>
            </div>

            <div className={styles.iconWrapper}>
              <Image src="/static/icons/star.svg" width="24" height="24" />
              <p className={styles.text}>{votingCount}</p>
            </div>

            <button
              className={styles.upvoteButton}
              onClick={handleUpvoteButton}
            >
              Up vote!
            </button>

            <p>{neighborhood}</p>
          </div>
        </div>
      </div>
    );
  }
};

export async function getStaticProps(context) {
  const params = context.params;
  const id = params.id;
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find(
    (coffeeStore) => coffeeStore.id == id
  );
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
      id,
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeStore) => ({
    params: {
      id: `${coffeStore.id}`,
    },
  }));
  return {
    paths,
    fallback: true,
  };
}

export default CoffeeStore;
