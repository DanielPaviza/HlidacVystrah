using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hlidacVystrah.Migrations
{
    /// <inheritdoc />
    public partial class final : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dpc");

            migrationBuilder.AlterColumn<int>(
                name: "id_severity",
                table: "notification",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "id_certainty",
                table: "notification",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "id_severity",
                table: "notification",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "id_certainty",
                table: "notification",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "dpc",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_area = table.Column<int>(type: "int", nullable: false),
                    id_certainty = table.Column<int>(type: "int", nullable: false),
                    id_event_type = table.Column<int>(type: "int", nullable: false),
                    id_severity = table.Column<int>(type: "int", nullable: false),
                    isRegion = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dpc", x => x.id);
                });
        }
    }
}
