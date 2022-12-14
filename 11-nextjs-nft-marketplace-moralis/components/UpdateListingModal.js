import { Input, Tooltip, Modal, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { writeToContract } from '../systems/interactWithContract';

export default function UpdateListingModal({ props, isVisible, hideModal }) {
  const {
    marketplaceAddress,
    marketplaceAbi,
    nftAddress,
    tokenName,
    tokenId,
    price,
  } = props;
  const [inputPrice, setInputPrice] = useState('0');
  const [isInputValid, setIsInputValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const { write: updateListing, isLoading: isUpdateLoading } = writeToContract(
    marketplaceAddress,
    marketplaceAbi,
    'updateListing',
    [
      nftAddress,
      tokenId,
      ethers.utils.parseEther(inputPrice) || '10000000000000000',
    ],
    { onSuccess: handleSuccess, onError: handleError },
  );

  const { write: cancelListing, isLoading: isCancelLoading } = writeToContract(
    marketplaceAddress,
    marketplaceAbi,
    'cancelListing',
    [nftAddress, tokenId],
    { onSuccess: handleSuccess, onError: handleError },
  );

  function handleSubmit(e, type) {
    if (type === 'updateListing') updateListing();
    if (type === 'cancelListing') cancelListing();
    setIsWalletOpen(true);
    e && e.stopPropagation();
  }

  async function handleSuccess(tx) {
    const txReceipt = await tx.wait(1);
    toast.success('Listing updated!');
    handleCancel();
    setInputPrice('0');
  }

  function handleError(err) {
    console.log(err);
    if (err.code === 'ACTION_REJECTED') {
      toast.error('Transaction rejected.');
    } else {
      toast.error('Error updating listing.');
    }
    handleCancel();
  }

  function handleCancel(e) {
    hideModal();
    setIsWalletOpen(false);
    e && e.stopPropagation();
  }

  function handleChange(e) {
    setInputPrice(e.target.value === '' ? '0' : e.target.value);

    if (e.target.value !== '' && e.target.value <= 0) {
      setIsInputValid(false);
      setErrorMessage('Price must be greater than 0.');
    } else if (
      e.target.value !== '' &&
      ethers.utils.parseEther(e.target.value).toString() === price
    ) {
      setIsInputValid(false);
      setErrorMessage('The new price is the same as the old one.');
    } else if (e.target.value === '') {
      setIsInputValid(false);
    } else {
      setIsInputValid(true);
      setErrorMessage('');
    }
  }

  return (
    <Modal
      title='Update Listing'
      open={isVisible}
      onOk={(e) => handleSubmit(e, 'updateListing')}
      onCancel={handleCancel}
      onClose={handleCancel}
      okText='Update'
      footer={[
        <Button
          key='unlist'
          type='primary'
          danger
          loading={isCancelLoading || isWalletOpen}
          onClick={(e) => handleSubmit(e, 'cancelListing')}
        >
          Cancel listing
        </Button>,
        <div className='wrap-btn'>
          <Button key='back' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            key='submit'
            type='primary'
            disabled={!isInputValid}
            loading={isUpdateLoading || isWalletOpen}
            onClick={() => handleSubmit(this, 'updateListing')}
          >
            Ok
          </Button>
        </div>,
      ]}
    >
      <div className='update-listing'>
        <div className='title'>
          <div className='name'>{tokenName} </div>
          <div className='token-id'>#{tokenId}</div>
        </div>
        <Input
          type='number'
          autoFocus={true}
          placeholder='New price'
          prefix={<i className='fa-brands fa-ethereum'></i>}
          addonAfter={
            <Tooltip title='Enter the new price in ETH'>
              <InfoCircleOutlined style={{ color: 'rgba(255,255,255,.75)' }} />
            </Tooltip>
          }
          onChange={handleChange}
          min={0}
        />
        <div className='error-message'>{errorMessage}</div>
      </div>
    </Modal>
  );
}
