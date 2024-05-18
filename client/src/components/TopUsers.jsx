import { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentUsers } from "../redux/topUsers";
import axios from "axios";
import { BASE_URL } from "../main";
import LineProfileCard from "./UI/LineProfileCard";
import Loader from "./UI/Loader";
const TopUsers = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.userAuth);
  const { topUsersList } = useSelector((state) => state.topUsers);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Used for adding loader for loading more results
  const resultsPerPage = 5;
  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        dispatch(fetchRecentUsers(userId));
      } catch (error) {
        console.error("Error fetching recent users:", error);
      }
    };
    fetchUsersList();
  }, [dispatch, userId]);
  const findUser = async (pageNo) => {
    let currPageNo = page;
    if (pageNo) {
      currPageNo = pageNo;
      setIsSearching(true);
    } else {
      setIsLoadingMore(true);
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/search/${search.trim()}?page=${currPageNo}&resultsPerPage=${resultsPerPage}`
      );
      if (response.data) {
        setSearchResults((prevResults) => [...prevResults, ...response.data]);
        setIsSearching(false);
        setIsLoadingMore(false);
        setPage((prevPage) => prevPage + 1);
        setHasMore(response.data.length === resultsPerPage);
      }
    } catch (error) {
      console.log(error);
      setIsSearching(false);
      setIsLoadingMore(false);
    }
  };
  const handleSearch = () => {
    setSearchResults([]);
    setPage(1);
    findUser(1);
  };
  const loadMore = () => {
    findUser();
  };
  return (
    <div className="w-full px-4">
      <div className="w-full sticky top-0 left-0 z-10 py-2 bg-white">
        <div className="w-full h-12 bg-backgroundDark rounded-full border border-backgroundDark flex justify-center items-center gap-3 pl-3 pr-2 focus-within:bg-white focus-within:border-primaryBorder ">
          <GoSearch className="text-2xl group:focus-within text-primary " />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent focus:outline-none text-dark1 font-medium"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value.trim().length === 0) {
                setSearchResults([]);
                setPage(1);
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="bg-dark2 text-white h-8 px-4 rounded-full"
          >
            Search
          </button>
        </div>
      </div>
      {!isSearching && search.length > 0 && searchResults.length > 0 && (
        <div className="my-2 w-full bg-backgroundDark rounded-3xl  py-4 min-h-80">
          <h1 className="text-2xl text-dark1 font-bold px-4 mb-2">
            {searchResults.length} result{searchResults.length > 1 ? "s" : ""}{" "}
            found {hasMore && "& more"}
          </h1>
          {searchResults?.map((user, index) => (
            <LineProfileCard key={index} user={user} />
          ))}
          {hasMore && !isLoadingMore && (
            <button
              onClick={loadMore}
              className="ml-6 my-2 flex justify-center items-center text-dark2 font-semibold "
            >
              Load More...
            </button>
          )}
          {isLoadingMore && (
            <div className="w-full flex justify-center items-center my-2">
              <Loader />
            </div>
          )}
        </div>
      )}
      {isSearching && search.length > 0 && (
        <div className="my-2 w-full bg-backgroundDark rounded-3xl  py-4 min-h-80 flex justify-center items-center">
          <Loader />
        </div>
      )}
      <div className="my-2 w-full bg-backgroundDark rounded-3xl  py-4 min-h-[394px]   ">
        {topUsersList?.length !== 0 && (
          <h1 className="text-2xl text-dark1 font-bold px-4 mb-2">
            New Members
          </h1>
        )}
        {topUsersList?.map((user, index) => (
          <LineProfileCard key={index} user={user} />
        ))}
        {topUsersList?.length === 0 && (
          <div className="w-full flex justify-center items-center min-h-[362px]">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUsers;
