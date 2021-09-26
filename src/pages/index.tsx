import { Button, Box } from '@chakra-ui/react';
import { FormEvent, useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    ({ pageParam = null }) =>
      api
        .get('/api/images', {
          params: { after: pageParam },
        })
        .then(response => response.data),
    {
      getNextPageParam: lastPage => lastPage.after ?? false,
    }
  );

  function loadMoreImages(event: FormEvent) {
    fetchNextPage();
  }

  const formattedData = useMemo(() => {
    if (data) {
      return data.pages.flatMap(page => page.data);
    }
    return null;
  }, [data]);

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <>
      <Header />
      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            type="button"
            onClick={loadMoreImages}
            mt="10"
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
