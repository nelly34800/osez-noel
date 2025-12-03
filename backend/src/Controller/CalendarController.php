<?php

namespace App\Controller;

use App\Entity\Calendar;
use App\Repository\CalendarRepository;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Annotations as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{JsonResponse, Request, Response};
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('api/calendar', name: 'app_api_calendar_')]
class CalendarController extends AbstractController
{
  public function __construct(
    private EntityManagerInterface $manager,
    private CalendarRepository $repository,
    private SerializerInterface $serializer,
    private UrlGeneratorInterface $urlGenerator,
    ) {
    }
    #[Route(methods: 'POST')]
    public function new(Request $request, UserRepository $userRepository): JsonResponse
      {
        $data = $request->toArray();

        $calendar = $this->serializer->deserialize($request->getContent(), Calendar::class, 'json');
        $calendar->setCreatedAt(new DateTimeImmutable());

        //gestion de la relation ManyToOne => user
        if (isset($data['user'])) {
            $user = $userRepository->find($data['user']);
            if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }
        $calendar->setUser($user);
    }

        // 3) Enregistrement
        $this->manager->persist($calendar);
        $this->manager->flush();

        $responseData = $this->serializer->serialize($calendar, 'json');
        $location = $this->urlGenerator->generate(
            'app_api_calendar_show',
            ['id' => $calendar->getId()],
            UrlGeneratorInterface::ABSOLUTE_URL,
        );

        return new JsonResponse($responseData, Response::HTTP_CREATED, ["Location" => $location], true);
    }

      #[Route('/{id}', name: 'show', methods: 'GET')]
    public function show(int $id): JsonResponse
      {
        $calendar = $this->repository->findOneBy(['id' => $id]);
        if ($calendar) {
          $responseData = $this->serializer->serialize($calendar, 'json');

            return new JsonResponse($responseData, Response::HTTP_OK, [], true);
        }

        return new JsonResponse(null, Response::HTTP_NOT_FOUND);
    }

      #[Route('/{id}', name: 'edit', methods: 'PUT')]
    public function edit(int $id, Request $request): JsonResponse
      {
        $calendar = $this->repository->findOneBy(['id' => $id]);
        if ($calendar) {
            $calendar = $this->serializer->deserialize(
                $request->getContent(),
                Calendar::class,
                'json',
                [AbstractNormalizer::OBJECT_TO_POPULATE => $calendar]
            );
            $calendar->setUpdatedAt(new DateTimeImmutable());

            $this->manager->flush();

            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        }

        return new JsonResponse(null, Response::HTTP_NOT_FOUND);
    }

      #[Route('/{id}', name: 'delete', methods: 'DELETE')]
    public function delete(int $id): JsonResponse
      {
        $calendar = $this->repository->findOneBy(['id' => $id]);
          if ($calendar) {
            $this->manager->remove($calendar);
            $this->manager->flush();

            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        }

        return new JsonResponse(null, Response::HTTP_NOT_FOUND);
    }
}