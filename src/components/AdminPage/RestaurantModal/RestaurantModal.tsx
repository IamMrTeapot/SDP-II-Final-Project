'use client'
import ModalOverlay from '@/components/Common/ModalOverlay/ModalOverlay'
import ModalHeaderText from './ModalHeaderText'
import InputFieldWithOutLabel from '@/components/Common/InputFieldWithOutLabel/InputFieldWithOutLabel'
import LocationIcon from '@/components/Common/Icon/LocationIcon'
import ImageIcon from '@/components/Common/Icon/ImageIcon'
import { useCallback, useState } from 'react'
import {
  RestaurantRequestBody,
  RestaurantService,
} from '@/services/RestaurantService'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import RestaurantSuccessModal from '@/components/Common/SuccessModal/RestaurantSuccessModal'
import RestaurantWarningModal from '@/components/Common/WarningModal/RestaurantWarningModal'

type ModalType = 'create' | 'edit'

type InputType =
  | 'name'
  | 'foodType'
  | 'address'
  | 'province'
  | 'postalCode'
  | 'telephone'
  | 'imageUrl'

const placeholderMessage: Record<InputType, string> = {
  name: 'Enter restaurant name',
  foodType: 'e.g. Thai, Chinese, Japanese',
  address: 'Enter your address',
  province: 'Bangkok',
  postalCode: '10100',
  telephone: 'Enter your telephone number',
  imageUrl: 'Fill in the image URL',
}

const errorMessage: Record<InputType, string> = {
  name: 'Please enter the restaurant name (max 50 characters)',
  address: 'Please enter the restaurant address',
  province: 'Please enter the restaurant province',
  postalCode: 'Please enter the restaurant postal code',
  telephone: 'Please enter the restaurant telephone',
  foodType: 'Please enter the restaurant food type',
  imageUrl: 'Please enter the restaurant image URL',
}

export default function RestaurantModal({
  isVisible,
  onClose,
  modalType,
  restaurantId,
  defaultName = '',
  defaultFoodType = '',
  defaultAddress = '',
  defaultProvince = '',
  defaultPostalCode = '',
  defaultTelephone = '',
  defaultImageUrl = '',
}: {
  isVisible: boolean
  onClose: () => void
  modalType: ModalType
  restaurantId?: string
  defaultName?: string
  defaultFoodType?: string
  defaultAddress?: string
  defaultProvince?: string
  defaultPostalCode?: string
  defaultTelephone?: string
  defaultImageUrl?: string
}) {
  const [name, setName] = useState(defaultName)
  const [foodType, setFoodType] = useState(defaultFoodType)
  const [address, setAddress] = useState(defaultAddress)
  const [province, setProvince] = useState(defaultProvince)
  const [postalCode, setPostalCode] = useState(defaultPostalCode)
  const [telephone, setTelephone] = useState(defaultTelephone)
  const [imageUrl, setImageUrl] = useState(defaultImageUrl)

  const [isNameError, setIsNameError] = useState(false)
  const [isFoodTypeError, setIsFoodTypeError] = useState(false)
  const [isAddressError, setIsAddressError] = useState(false)
  const [isProvinceError, setIsProvinceError] = useState(false)
  const [isPostalCodeError, setIsPostalCodeError] = useState(false)
  const [isTelephoneError, setIsTelephoneError] = useState(false)
  const [isImageUrlError, setIsImageUrlError] = useState(false)

  const [isShowWarningModal, setIsShowWarningModal] = useState(false)
  const [isShowSuccessModal, setIsShowSuccessModal] = useState(false)

  const router = useRouter()
  const { data: session } = useSession()
  if (!session) {
    alert('Please login to access this page')
    router.push('/admin/auth')
    return
  }

  const validateInput = useCallback(() => {
    const isNameValid = name !== '' && name.length <= 50
    const isFoodTypeValid = foodType !== ''
    const isAddressValid = address !== ''
    const isProvinceValid = province !== ''
    const isPostalCodeValid = postalCode.length <= 5
    const isTelephoneValid = telephone.length === 10
    const isImageUrlValid = imageUrl !== ''

    setIsNameError(!isNameValid)
    setIsFoodTypeError(!isFoodTypeValid)
    setIsAddressError(!isAddressValid)
    setIsProvinceError(!isProvinceValid)
    setIsPostalCodeError(!isPostalCodeValid)
    setIsTelephoneError(!isTelephoneValid)
    setIsImageUrlError(!isImageUrlValid)

    return (
      isNameValid &&
      isFoodTypeValid &&
      isAddressValid &&
      isProvinceValid &&
      isPostalCodeValid &&
      isTelephoneValid &&
      isImageUrlValid
    )
  }, [
    name,
    foodType,
    address,
    province,
    postalCode,
    telephone,
    imageUrl,
    setIsNameError,
    setIsAddressError,
    setIsFoodTypeError,
    setIsPostalCodeError,
    setIsProvinceError,
    setIsTelephoneError,
    setIsImageUrlError,
  ])

  const handleConfirmEdit = async (
    restaurantId: string,
    request: RestaurantRequestBody,
    token: string
  ) => {
    try {
      await RestaurantService.editRestaurantById(restaurantId, request, token)
    } catch (error) {
      console.log(error)
    }
  }

  const handleConfirmCreate = async (
    requestBody: RestaurantRequestBody,
    token: string
  ) => {
    try {
      await RestaurantService.createRestaurant(requestBody, token)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <ModalOverlay isVisible={isVisible} onClose={onClose}>
        <div
          className="w-[735px] max-h-[450px] px-16 pt-8 pb-8 bg-zinc-100 shadow rounded-[30px]
        flex flex-col gap-3 items-center z-50 overflow-auto no-scrollbar"
        >
          <ModalHeaderText
            label={
              modalType === 'create' ? 'Create Restaurant' : 'Edit Restaurant'
            }
          />
          <div className="w-full flex items-center">
            <label
              htmlFor="restaurant-name"
              className="w-[30%] text-right pe-4"
            >
              Restaurant Name
            </label>
            <div className="w-[60%]">
              <InputFieldWithOutLabel
                name={'restaurant-name'}
                onChange={(value) => setName(value)}
                placeholder={placeholderMessage['name']}
                isError={isNameError}
                errorMessage={errorMessage['name']}
                defaultValue={name}
              />
            </div>
          </div>
          <div className="w-full flex items-center">
            <label htmlFor="food-type" className="w-[30%] text-right pe-4">
              Food Type
            </label>
            <div className="w-[40%]">
              <InputFieldWithOutLabel
                name={'food-type'}
                onChange={(value) => setFoodType(value)}
                placeholder={placeholderMessage['foodType']}
                isError={isFoodTypeError}
                errorMessage={errorMessage['foodType']}
                defaultValue={foodType}
              />
            </div>
          </div>
          <div className="w-full flex items-center gap-4">
            <LocationIcon />
            <label htmlFor="address" className="w-[10%] text-right pe-4">
              Address
            </label>
            <div className="w-[75%]">
              <InputFieldWithOutLabel
                name={'address'}
                onChange={(value) => setAddress(value)}
                placeholder={placeholderMessage['address']}
                isError={isAddressError}
                errorMessage={errorMessage['address']}
                defaultValue={address}
              />
            </div>
          </div>
          <div className="w-full flex items-center gap-4 ps-[38px]">
            <label htmlFor="province" className="w-[10%] text-right me-[6px]">
              Province
            </label>
            <div className="w-[30%]">
              <InputFieldWithOutLabel
                name={'province'}
                onChange={(value) => setProvince(value)}
                placeholder={placeholderMessage['province']}
                isError={isProvinceError}
                errorMessage={errorMessage['province']}
                defaultValue={province}
              />
            </div>
            <label htmlFor="postal_code" className="w-[15%] text-right ">
              Postal Code
            </label>
            <div className="w-[30%]">
              <InputFieldWithOutLabel
                name={'postal_code'}
                onChange={(value) => setPostalCode(value)}
                placeholder={placeholderMessage['postalCode']}
                isError={isPostalCodeError}
                errorMessage={errorMessage['postalCode']}
                defaultValue={postalCode}
              />
            </div>
          </div>
          <div className="w-full flex items-center gap-4 ps-[42px]">
            <label htmlFor="telephone" className="w-[10%] text-right me-1">
              Tel
            </label>
            <div className="w-[60%]">
              <InputFieldWithOutLabel
                name={'telephone'}
                onChange={(value) => setTelephone(value)}
                placeholder={placeholderMessage['telephone']}
                isError={isTelephoneError}
                errorMessage={errorMessage['telephone']}
                defaultValue={telephone}
              />
            </div>
          </div>
          <div className="w-full flex items-center gap-2 mb-4">
            <ImageIcon />
            <label htmlFor="image-url" className="w-[20%] text-right me-2">
              Upload Image
            </label>
            <div className="w-[70%]">
              <InputFieldWithOutLabel
                name={'image-url'}
                onChange={(value) => setImageUrl(value)}
                placeholder={placeholderMessage['imageUrl']}
                isError={isImageUrlError}
                errorMessage={errorMessage['imageUrl']}
                defaultValue={imageUrl}
              />
            </div>
          </div>
          <div className="flex justify-center items-center gap-10">
            <button
              className="px-4 py-2 bg-sky-400 rounded justify-start items-center 
          gap-2 inline-flex text-white text-base font-medium hover:bg-blue-500"
              onClick={async () => {
                if (validateInput()) {
                  if (modalType === 'edit') {
                    setIsShowWarningModal(true)
                  } else if (modalType === 'create') {
                    await handleConfirmCreate(
                      {
                        name,
                        address,
                        foodtype: foodType,
                        province,
                        postalcode: postalCode,
                        tel: telephone,
                        picture: imageUrl,
                      },
                      session.user.token
                    )
                    setIsShowSuccessModal(true)
                  }
                }
              }}
            >
              Confirm
            </button>
            <button
              className="px-4 py-2 bg-red-500 rounded justify-start items-center 
          gap-2 inline-flex text-white text-base font-medium hover:bg-red-700"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalOverlay>
      <RestaurantSuccessModal
        type={modalType === 'create' ? 'CREATE' : 'UPDATE'}
        isVisible={isShowSuccessModal}
        onClose={() => {
          setIsShowSuccessModal(false)
          onClose()
          window.location.reload()
        }}
        restaurantName={name}
      />
      {modalType === 'edit' && (
        <RestaurantWarningModal
          type={'UPDATE'}
          isVisible={isShowWarningModal}
          onDismiss={() => setIsShowWarningModal(false)}
          onConfirm={async () => {
            await handleConfirmEdit(
              restaurantId ?? '',
              {
                name,
                address,
                foodtype: foodType,
                province,
                postalcode: postalCode,
                tel: telephone,
                picture: imageUrl,
              },
              session.user.token
            )
            setIsShowWarningModal(false)
            setIsShowSuccessModal(true)
          }}
          restaurantName={name}
        />
      )}
    </>
  )
}
