import React, { useState } from "react";
import Modal from "../common/Modal";

import {
  modalInput,
  modalDropdown,
  modalDropdownItem,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

import useDebounce from "../../hooks/useDebounce";
import { useAvailableFarmer } from "../../hooks/useAvailableFarmer";

export default function AddDistributionModal({
  distributionID,
  onClose,
  onSubmit,
  loading,
}) {
  const [searchFarmer, setSearchFarmer] = useState("");
  const [selectedFarmer, setSelectedFarmer] =
    useState(null);

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // ================= DEBOUNCE SEARCH =================
  const debouncedSearch = useDebounce(
    searchFarmer,
    300
  );

  // ================= FETCH AVAILABLE FARMERS =================
  const availableFarmerQuery =
    useAvailableFarmer(
      distributionID,
      debouncedSearch
    );

  const availableFarmers =
    availableFarmerQuery.data?.data || [];

  const loadingFarmers =
    availableFarmerQuery.isLoading;

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!selectedFarmer || !amount) {
      setError(
        "Please select a farmer and enter amount"
      );
      return;
    }

    if (Number(amount) <= 0) {
      setError(
        "Amount must be greater than 0"
      );
      return;
    }

    onSubmit({
      FarmerID: selectedFarmer.FarmerID,
      Amount: parseFloat(amount),
    });
  };

  return (
    <Modal
      title="Add Farmer Subsidy"
      onClose={onClose}
      width="max-w-lg"
    >
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 text-sm rounded mb-3">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-sm"
      >
        {/* FARMER SEARCH */}
        <div>
          <label className={modalLabel}>
            Select Farmer
          </label>

          <input
            type="text"
            placeholder="Search farmer..."
            value={searchFarmer}
            onChange={(e) => {
              setSearchFarmer(e.target.value);
              setSelectedFarmer(null);
            }}
            className={modalInput}
          />

          {/* LOADING */}
          {loadingFarmers && (
            <div className="mt-2 text-xs text-gray-500">
              Searching farmers...
            </div>
          )}

          {/* EMPTY */}
          {!loadingFarmers &&
            !selectedFarmer &&
            availableFarmers.length === 0 &&
            searchFarmer.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                No farmers found
              </p>
            )}

          {/* RESULTS */}
          {!selectedFarmer &&
            availableFarmers.length > 0 && (
              <div className={modalDropdown}>
                {availableFarmers.map(
                  (farmer) => (
                    <div
                      key={farmer.FarmerID}
                      onClick={() => {
                        setSelectedFarmer(
                          farmer
                        );
                        setSearchFarmer(
                          `${farmer.FirstName} ${farmer.LastName}`
                        );
                      }}
                      className={
                        modalDropdownItem
                      }
                    >
                      {farmer.FirstName}{" "}
                      {farmer.LastName}
                    </div>
                  )
                )}
              </div>
            )}
        </div>

        {/* AMOUNT */}
        <div>
          <label className={modalLabel}>
            Amount
          </label>

          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            className={`${modalInput} dark:[color-scheme:dark]`}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={modalButtonSecondary}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={modalButtonPrimary}
          >
            {loading
              ? "Saving..."
              : "Assign Subsidy"}
          </button>
        </div>
      </form>
    </Modal>
  );
}