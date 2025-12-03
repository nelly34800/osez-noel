<?php

namespace App\Controller;

use App\Entity\SharedCalendar;
use App\Repository\SharedCalendarRepository;
use App\Repository\CalendarRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Annotations as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{JsonResponse, Request, Response};
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('api/sharedCalendar', name: 'app_api_sharedCalendar_')]
class SharedCalendarController extends AbstractController
{
  public function __construct(
    private EntityManagerInterface $manager,
    private SharedCalendarRepository $repository,
    private SerializerInterface $serializer,
    private UrlGeneratorInterface $urlGenerator,
    ) {
    }
    #[Route(methods: 'POST')]
    public function new(Request $request, CalendarRepository $calendarRepository): JsonResponse
      {
        $data = $request->toArray();

        $sharedCalendar = $this->serializer->deserialize($request->getContent(), SharedCalendar::class, 'json');
        $sharedCalendar->setCreatedAt(new DateTimeImmutable());

        //gestion de la relation ManyToOne => calendar
        if (isset($data['calendar'])) {
            $calendar = $calendarRepository->find($data['calendar']);
            if (!$calendar) {
            return new JsonResponse(['error' => 'calendar not found'], 404);
        }
        $sharedCalendar->setCalendar($calendar);
    }


        $this->manager->persist($sharedCalendar);
        $this->manager->flush();

        $responseData = $this->serializer->serialize($sharedCalendar, 'json');
        $location = $this->urlGenerator->generate(
            'app_api_sharedCalendar_show',
            ['id' => $sharedCalendar->getId()],
            UrlGeneratorInterface::ABSOLUTE_URL,
        );

        return new JsonResponse($responseData, Response::HTTP_CREATED, ["Location" => $location], true);
    }

      #[Route('/{id}', name: 'show', methods: 'GET')]
    public function show(int $id): JsonResponse
      {
        $sharedCalendar = $this->repository->findOneBy(['id' => $id]);
        if ($sharedCalendar) {
          $responseData = $this->serializer->serialize($sharedCalendar, 'json');

            return new JsonResponse($responseData, Response::HTTP_OK, [], true);
        }

        return new JsonResponse(null, Response::HTTP_NOT_FOUND);
    }

      #[Route('/{id}', name: 'edit', methods: 'PUT')]
    public function edit(int $id, Request $request): JsonResponse
      {
        $sharedCalendar = $this->repository->findOneBy(['id' => $id]);
        if ($sharedCalendar) {
            $sharedCalendar = $this->serializer->deserialize(
                $request->getContent(),
                SharedCalendar::class,
                'json',
                [AbstractNormalizer::OBJECT_TO_POPULATE => $sharedCalendar]
            );
            $sharedCalendar->setUpdatedAt(new DateTimeImmutable());

            $this->manager->flush();

            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        }

        return new JsonResponse(null, Response::HTTP_NOT_FOUND);
    }

      #[Route('/{id}', name: 'delete', methods: 'DELETE')]
    public function delete(int $id): JsonResponse
      {
        $sharedCalendar = $this->repository->findOneBy(['id' => $id]);
          if ($sharedCalendar) {
            $this->manager->remove($sharedCalendar);
            $this->manager->flush();

            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        }

        return new JsonResponse(null, Response::HTTP_NOT_FOUND);
    }
}