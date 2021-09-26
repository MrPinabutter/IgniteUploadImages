import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalBody>
        <ModalContent
          borderBottomRightRadius="6"
          borderBottomLeftRadius="6"
          overflow="hidden"
          background="transparent"
        >
          <Image src={imgUrl} alt={imgUrl} />
          <ModalFooter
            bgColor="pGray.800"
            p="2"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Link href={imgUrl} target="blank" fontSize="14px" fontWeight="400">
              Abrir original
            </Link>
          </ModalFooter>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
