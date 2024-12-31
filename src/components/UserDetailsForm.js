import React from 'react';

const UserDetailsForm = ({ userInfo, onChange, onNext }) => {
  return (
    <div>
      <h2>Enter Your Details</h2>
      <form>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Phone:
            <input
              type="tel"
              name="phone"
              value={userInfo.phone}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            SSN:
            <input
              type="text"
              name="ssn"
              value={userInfo.ssn}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <button type="button" onClick={onNext}>
          Next
        </button>
      </form>
    </div>
  );
};

export default UserDetailsForm;
