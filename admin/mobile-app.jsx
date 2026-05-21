/* eslint-disable */
// Mobile app router — handles its own page state inside the phone frame

const MobileApp = ({ products, setProducts, sections, setSections, categories, site, onSwitchSite, onLogout, offline }) => {
  const [route, setRoute] = React.useState("m-home");
  const [editingId, setEditingId] = React.useState(null);
  const [bulkOpen, setBulkOpen] = React.useState(false);

  const draftCount = products.filter((p) => p.draft).length + sections.filter((s) => s.draft).length;

  const nav = (r, arg) => {
    if (r === "m-editor") {
      setEditingId(arg || null);
      setRoute("m-editor");
    } else if (r === "m-quick-add") {
      setEditingId(null);
      setRoute("m-editor");
    } else {
      setEditingId(null);
      setRoute(r);
    }
  };
  const back = () => {
    if (route === "m-editor") setRoute("m-products");
    else if (route === "m-publish") setRoute("m-home");
    else setRoute("m-home");
  };

  return (
    <MobileFrame>
      {offline && <OfflineBanner simulated mobile queueCount={draftCount} />}
      {route === "m-home" && (
        <MobileHomePage
          products={products}
          sections={sections}
          site={site}
          onNav={nav}
          onBulkPrice={() => setBulkOpen(true)}
        />
      )}
      {route === "m-home-sections" && (
        <MobileHomeSectionsPage
          sections={sections}
          setSections={setSections}
          products={products}
          onBack={() => setRoute("m-more")}
        />
      )}
      {route === "m-products" && (
        <MobileProductsPage
          products={products}
          setProducts={setProducts}
          categories={categories}
          onEdit={(id) => nav("m-editor", id)}
          onAdd={() => nav("m-editor", null)}
        />
      )}
      {route === "m-editor" && (
        <MobileEditorPage
          productId={editingId}
          products={products}
          setProducts={setProducts}
          categories={categories}
          onBack={() => setRoute("m-products")}
        />
      )}
      {route === "m-publish" && (
        <MobilePublishPage
          products={products}
          sections={sections}
          setProducts={setProducts}
          setSections={setSections}
          onBack={back}
          site={site}
        />
      )}
      {route === "m-more" && (
        <MobileMorePage
          site={site}
          onSwitchSite={onSwitchSite}
          onSheet={() => setBulkOpen(true)}
          onHomeSections={() => setRoute("m-home-sections")}
          onLogout={onLogout}
        />
      )}

      {route !== "m-editor" && route !== "m-publish" && route !== "m-home-sections" && (
        <MobileTabBar route={route} onNav={nav} draftCount={draftCount} />
      )}

      <BulkPriceSheet
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        products={products}
        setProducts={setProducts}
        categories={categories}
      />
    </MobileFrame>
  );
};

Object.assign(window, { MobileApp });
