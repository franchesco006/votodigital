<?php

namespace App\Entity;

use App\Repository\MunicipioRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MunicipioRepository::class)]
class Municipio
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 120)]
    private ?string $nombre = null;

    #[ORM\Column(length: 10)]
    private ?string $codigoPostal = null;

    #[ORM\Column]
    private ?int $poblacion = null;

    #[ORM\Column]
    private ?int $votosTotales = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getCodigoPostal(): ?string
    {
        return $this->codigoPostal;
    }

    public function setCodigoPostal(string $codigoPostal): static
    {
        $this->codigoPostal = $codigoPostal;

        return $this;
    }

    public function getPoblacion(): ?int
    {
        return $this->poblacion;
    }

    public function setPoblacion(int $poblacion): static
    {
        $this->poblacion = $poblacion;

        return $this;
    }

    public function getVotosTotales(): ?int
    {
        return $this->votosTotales;
    }

    public function setVotosTotales(int $votosTotales): static
    {
        $this->votosTotales = $votosTotales;

        return $this;
    }
}
