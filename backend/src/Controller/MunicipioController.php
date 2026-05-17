<?php

namespace App\Controller;

use App\Entity\Municipio;
use App\Repository\MunicipioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/municipios')]
class MunicipioController extends AbstractController
{
    #[Route('', name: 'municipios_index', methods: ['GET'])]
    public function index(MunicipioRepository $repo, SerializerInterface $serializer): JsonResponse
    {
        $json = $serializer->serialize($repo->findAll(), 'json');
        return new JsonResponse($json, Response::HTTP_OK, ['Access-Control-Allow-Origin' => '*'], true);
    }

    #[Route('/{id}', name: 'municipios_show', methods: ['GET'])]
    public function show(Municipio $municipio, SerializerInterface $serializer): JsonResponse
    {
        $json = $serializer->serialize($municipio, 'json');
        return new JsonResponse($json, Response::HTTP_OK, ['Access-Control-Allow-Origin' => '*'], true);
    }

    #[Route('', name: 'municipios_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, SerializerInterface $serializer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['nombre'], $data['codigoPostal'], $data['poblacion'])) {
            return $this->json(['error' => 'Faltan campos requeridos.'], 400);
        }
        $municipio = new Municipio();
        $municipio->setNombre($data['nombre']);
        $municipio->setCodigoPostal($data['codigoPostal']);
        $municipio->setPoblacion((int)$data['poblacion']);
        $municipio->setVotosTotales((int)($data['votosTotales'] ?? 0));
        $em->persist($municipio);
        $em->flush();
        $json = $serializer->serialize($municipio, 'json');
        return new JsonResponse($json, Response::HTTP_CREATED, ['Access-Control-Allow-Origin' => '*'], true);
    }

    #[Route('/{id}', name: 'municipios_update', methods: ['PUT'])]
    public function update(Municipio $municipio, Request $request, EntityManagerInterface $em, SerializerInterface $serializer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (isset($data['nombre']))       $municipio->setNombre($data['nombre']);
        if (isset($data['codigoPostal'])) $municipio->setCodigoPostal($data['codigoPostal']);
        if (isset($data['poblacion']))    $municipio->setPoblacion((int)$data['poblacion']);
        if (isset($data['votosTotales'])) $municipio->setVotosTotales((int)$data['votosTotales']);
        $em->flush();
        $json = $serializer->serialize($municipio, 'json');
        return new JsonResponse($json, Response::HTTP_OK, ['Access-Control-Allow-Origin' => '*'], true);
    }

    #[Route('/{id}', name: 'municipios_delete', methods: ['DELETE'])]
    public function delete(Municipio $municipio, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($municipio);
        $em->flush();
        return new JsonResponse(['message' => 'Municipio eliminado.'], 200, ['Access-Control-Allow-Origin' => '*']);
    }

    #[Route('', name: 'municipios_options', methods: ['OPTIONS'])]
    #[Route('/{id}', name: 'municipios_options_id', methods: ['OPTIONS'])]
    public function options(): JsonResponse
    {
        return new JsonResponse(null, 204, [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization',
        ]);
    }
}