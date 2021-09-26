import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

type ImageProps = {
  title: string | unknown;
  description: string | unknown;
  url: string;
};

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  function imageFormatValidation(type: string): boolean {
    const formatsRegex = /^([jJ][pP][gG]|([jJ][pP][eE][gG])|[gG][iI][fF]|[pP][nN][gG])$/;

    const [fileType, fileFormat] = type.split('/');

    if (fileType !== 'image') return false;

    return formatsRegex.test(fileFormat);
  }

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório.',
      validate: {
        lessThan10mb: (image: File) =>
          image[0].size < 10000 * 1024 || 'O arquivo deve ser menor que 10MB',

        acceptedFormats: (image: File) =>
          imageFormatValidation(image[0].type) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'Adcione um título.',
      minLength: {
        value: 2,
        message: 'Mínimo 2 caracteres.',
      },
      maxLength: {
        value: 20,
        message: 'Máximo 20 caracteres.',
      },
    },
    description: {
      required: 'Adicione uma descrição.',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres.',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (image: ImageProps) => api.post('/api/images', image),
    {
      onSuccess: () => queryClient.invalidateQueries('images'),
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
        });
        return;
      }
      const { title, description } = data;
      const image = {
        title,
        description,
        url: imageUrl,
      };
      await mutation.mutateAsync(image);

      toast({
        title: 'Imagem cadastrada',
        status: 'success',
      });
    } catch {
      toast({
        title: 'Erro ao cadastrar imagem',
        status: 'error',
      });
    } finally {
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          name="image"
          error={errors?.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          error={errors?.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="description"
          error={errors?.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
