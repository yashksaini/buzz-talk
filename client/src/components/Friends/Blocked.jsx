import NoDataFound from "../UI/NoDataFound";

const Blocked = () => {
  return (
    <div>
      <NoDataFound
        title="No Blocked Friends"
        desc="You haven't blocked any friends yet. Blocked friends will appear here once you add them to your blocked list."
      />
    </div>
  );
};

export default Blocked;
